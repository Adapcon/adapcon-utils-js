import { isObject } from '../../object'
import { error } from '../../error'
import type { DynamodbParams, ScanOutput } from './types'
import {
  DynamoDBDocument,
  GetCommand,
  QueryCommand,
  BatchGetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  BatchWriteCommand,
  ScanCommandInput
} from '@aws-sdk/lib-dynamodb'
import type {
  GetCommandInput,
  QueryCommandInput,
  PutCommandInput,
  UpdateCommandInput,
  DeleteCommandInput,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  QueryCommandOutput
} from '@aws-sdk/lib-dynamodb'
import { DynamoDB, ScanCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const getOptions = () => {
  if (process.env.IS_OFFLINE) return { region: 'localhost', endpoint: 'http://localhost:8000' }
  return { region: 'sa-east-1' }
}
const dynamoInstance = new DynamoDB(getOptions())
const documentInstance = DynamoDBDocument.from(dynamoInstance, {
  marshallOptions: { removeUndefinedValues: true }
})

const get = async<T>({
  params,
  fields = []
}: { params: GetCommandInput, fields?: string[] }): Promise<T | undefined> => {
  const command = new GetCommand({ ...params, ...mountProjectionExpression({ fields }) })

  const { Item } = await documentInstance.send(command) as Omit<QueryCommandOutput, 'Item'> & { Item: T } ?? {}
  return Item
}

const query = async <T>({
  params, fields = [], _items = [], stopOnLimit = false
}: { params: { Limit?: number } & QueryCommandInput, fields?: string[], _items?: T[], stopOnLimit?: boolean }): Promise<T[]> => {
  if (!Number(params.Limit) || Number.isNaN(params.Limit)) delete params.Limit

  const command = new QueryCommand({ ...params, ...mountProjectionExpression({ fields, expressionAttributeNames: params.ExpressionAttributeNames }) })
  const { Items = [], LastEvaluatedKey } = await documentInstance.send(command) as QueryCommandOutput & { Items: T[] }

  const items = [..._items, ...Items]

  if (stopOnLimit && items.length >= (params.Limit ?? 0)) return items
  else if (LastEvaluatedKey) {
    return query({
      params: { ...params, ExclusiveStartKey: LastEvaluatedKey },
      fields,
      _items: items,
      stopOnLimit
    })
  }

  return items
}

async function scan<T> (params: ScanCommandInput): Promise<ScanOutput<T>> {
  const command = new ScanCommand(params)
  const result = await documentInstance.send(command)

  const Items = result.Items?.map(item => unmarshall(item)) as T[] | undefined

  return {
    Items,
    LastEvaluatedKey: result.LastEvaluatedKey
  }
}

const getAll = async ({ params, list, fields = [] }: { params: DynamodbParams, list: object[], fields?: string[] }) => {
  let idx = 0

  // ? Pack 25 requests at a time (batchGet limit)

  const packs: any = list.reduce((acc, param) => {
    if (acc[idx] && acc[idx].length >= 25) idx++

    if (!acc[idx]) acc[idx] = []

    acc[idx].push({ ...param })

    return acc
  }, [])

  const data = await Promise.all(packs.map(async keys => {
    const opts = {
      RequestItems: {
        [params.TableName]: {
          Keys: keys,
          ...mountProjectionExpression({ fields })
        }
      }
    }

    const command = new BatchGetCommand(opts)
    const { Responses } = await documentInstance.send(command)
    return Responses?.[params.TableName]
  }))

  return data.reduce((acc: any, i) => acc.concat(i), [])
}

const put = async ({ params }: { params: PutCommandInput }): Promise<object> => {
  try {
    const command = new PutCommand(params)
    await documentInstance.send(command)

    return {}
  } catch (err) {
    if (err && err.code === 'ConditionalCheckFailedException') return {}
    throw error(500, err.message)
  }
}

const update = async ({ params }: { params: UpdateCommandInput }): Promise<any> => {
  try {
    const command = new UpdateCommand(params)
    return await documentInstance.send(command)
  } catch (err) {
    throw error(500, err.message)
  }
}

const deleteOne = async ({ params }: { params: DeleteCommandInput }): Promise<Record<string, any> | undefined> => {
  try {
    const command = new DeleteCommand(params)
    await documentInstance.send(command)

    return params.Key
  } catch (err) {
    throw error(500, err.message)
  }
}

const deleteBatch = async ({ params, list }: { params: DynamodbParams, list: object[] }): Promise<void> => {
  let idx = 0

  // ? Pack 25 requests at a time (batchWrite limit)

  const packs: any = list.reduce((acc, param) => {
    if (acc[idx] && acc[idx].RequestItems[params.TableName].length >= 25) idx++

    if (!acc[idx]) {
      acc[idx] = {
        RequestItems: {
          [params.TableName]: []
        }
      }
    }

    acc[idx].RequestItems[params.TableName].push({
      DeleteRequest: {
        Key: param
      }
    })

    return acc
  }, [])

  await executeBatch(packs)
}

const deleteAll = async (params: DeleteCommandInput[] = []): Promise<Array<Record<string, any> | undefined>> => {
  return Promise.all(
    params.map(async param => deleteOne({
      params: param
    }))
  )
}

const putBatch = async ({ params, list }: { params: DynamodbParams, list: object[] }): Promise<void> => {
  let idx = 0

  // ? Pack 25 requests at a time (batchWrite limit)

  const packs: any = list.reduce((acc, param) => {
    if (acc[idx] && acc[idx].RequestItems[params.TableName].length >= 25) idx++

    if (!acc[idx]) {
      acc[idx] = {
        RequestItems: {
          [params.TableName]: []
        }
      }
    }

    acc[idx].RequestItems[params.TableName].push({
      PutRequest: {
        Item: param
      }
    })

    return acc
  }, [])

  await executeBatch(packs)
}

const executeBatch = async (packs: BatchWriteCommandInput[] = []): Promise<void> => {
  const results = await Promise.all(packs.map(async pack => {
    const command = new BatchWriteCommand(pack)
    return documentInstance.send(command)
  }))

  const newPacks = getUnprocessedItems(results)

  if (Array.isArray(newPacks) && newPacks.length > 0) { await executeBatch(newPacks) }
}

const getUnprocessedItems = async (responseBatch: BatchWriteCommandOutput[]): Promise<object[]> => {
  let idx = 0

  return responseBatch.reduce((acc: any, value) => {
    if (!isObject(value) || !isObject(value.UnprocessedItems)) return acc

    // ? Our batches use only 1 table each time
    const tableName = Object.keys(value.UnprocessedItems ?? [])[0]

    // ? there is no unprocessed item
    if (!tableName) return acc

    const processList = value.UnprocessedItems?.[tableName] ?? []

    processList.forEach(process => {
      if (acc[idx] && acc[idx].RequestItems[tableName].length >= 25) idx++

      if (!acc[idx]) {
        acc[idx] = {
          RequestItems: {
            [tableName]: []
          }
        }
      }

      acc[idx].RequestItems[tableName].push(process)
    })

    return acc
  }, [])
}

const dynamicUpdate = async ({
  object,
  removeAttributes,
  params
}: { object: object, removeAttributes?: string[], params: UpdateCommandInput }): Promise<any> => {
  try {
    const updateExpressionItems: string[] = []
    const removeExpressionItems: string[] = []
    const ExpressionAttributeValues = {}
    const ExpressionAttributeNames = {}

    Object.entries(object).forEach(([key, value]) => {
      const attributeName = `#${key}`
      const attributeValue = `:${key}`

      updateExpressionItems.push(`${attributeName} = ${attributeValue}`)
      ExpressionAttributeValues[attributeValue] = value
      ExpressionAttributeNames[attributeName] = key
    })

    if (Array.isArray(removeAttributes)) {
      removeAttributes.forEach(key => {
        const attributeName = `#${key}`

        removeExpressionItems.push(attributeName)
        ExpressionAttributeNames[attributeName] = key
      })
    }

    const UpdateExpression = `\
        ${updateExpressionItems.length ? `SET ${updateExpressionItems.join(', ')}` : ''}\
        ${removeExpressionItems.length ? `REMOVE ${removeExpressionItems.join(', ')}` : ''}\
      `

    const updateParams: UpdateCommandInput = {
      ...params,
      UpdateExpression,
      ExpressionAttributeValues,
      ExpressionAttributeNames,
      ReturnValues: 'UPDATED_NEW'
    }

    const command = new UpdateCommand(updateParams)
    return await documentInstance.send(command)
  } catch (err) {
    if (err && err.code === 'ConditionalCheckFailedException') return {}
    throw error(500, err.message)
  }
}

const dynamicFilters = ({
  ExpressionAttributeNames,
  ExpressionAttributeValues
}: { ExpressionAttributeNames?: object, ExpressionAttributeValues?: object }, filters: object[]): object => {
  const newExpressionAttributeNames = { ...(ExpressionAttributeNames ?? {}) }
  const newExpressionAttributeValues = { ...(ExpressionAttributeValues ?? {}) }

  const filterExpression: string[] = []

  if (filters.length > 0) {
    filters.forEach(({ field, value, operator = '=' }: { field: string, value: any, operator: string }, index: number) => {
      if (operator === 'BETWEEN') {
        const [start, end] = value
        filterExpression.push(`#filter_${index} ${operator} :filter_between_0_${index} AND :filter_between_1_${index}`)

        newExpressionAttributeNames[`#filter_${index}`] = field
        newExpressionAttributeValues[`:filter_between_0_${index}`] = start
        newExpressionAttributeValues[`:filter_between_1_${index}`] = end
      } else if (operator === 'IN') {
        const inValues = value.map((_, i: number) => `:filter_in_${index}_${i}`)
        const values: string = inValues.join(', ')
        filterExpression.push(`#filter_${index} ${operator} (${values})`)

        newExpressionAttributeNames[`#filter_${index}`] = field
        value.forEach((v: string, i: number) => {
          newExpressionAttributeValues[`:filter_in_${index}_${i}`] = v
        })
      } else {
        filterExpression.push(`#filter_${index} ${operator} :filter_${index}`)

        newExpressionAttributeNames[`#filter_${index}`] = field
        newExpressionAttributeValues[`:filter_${index}`] = value
      }
    })
  }

  if (!filterExpression.length) return {}

  return {
    ExpressionAttributeNames: newExpressionAttributeNames,
    ExpressionAttributeValues: newExpressionAttributeValues,
    FilterExpression: filterExpression.join(' AND ')
  }
}

const mountProjectionExpression = ({ fields = [], expressionAttributeNames, options }: {
  fields?: string[]
  expressionAttributeNames?: QueryCommandInput['ExpressionAttributeNames']
  options?: DynamodbParams
}): object => {
  if (fields.length > 0) {
    const ProjectionExpression = fields.map((_, index) => `#Projection_${index}`).join(',')
    const { ExpressionAttributeNames = expressionAttributeNames ?? {} } = options ?? {}

    fields.forEach((i, index) => {
      ExpressionAttributeNames[`#Projection_${index}`] = i
    })

    return { ProjectionExpression, ExpressionAttributeNames }
  }
  return {}
}

export const dynamoDBGenericDao = {
  get,
  query,
  scan,
  getAll,
  put,
  update,
  deleteOne,
  deleteBatch,
  deleteAll,
  putBatch,
  executeBatch,
  getUnprocessedItems,
  dynamicUpdate,
  dynamicFilters,
  mountProjectionExpression
}
