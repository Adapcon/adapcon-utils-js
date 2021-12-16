import { isObject } from '../object'
import dbClient from 'aws-dynamodb-factory-js'
import { error } from '../error'
import type { DynamodbParams, DynamodbResponseBatch } from './interfaces'

const get = async ({
  params,
  fields = []
}: { params: DynamodbParams, fields?: string[] }): Promise<object> => {
  const { Item } = await dbClient.doc().get({
    ...params,
    ...mountProjectionExpression({ fields, options: params })
  }).promise()

  return Item
}

const query = async ({
  params, fields = [], _items = [], stopOnLimit = false
}: { params: DynamodbParams, fields?: string[], _items?: object[], stopOnLimit?: boolean }): Promise<object[]> => {
  const { Items, LastEvaluatedKey } = await dbClient.doc().query({
    ...params,
    ...mountProjectionExpression({ fields, options: params })
  }).promise()

  const newItemsList = (Array.isArray(Items) && Items.length > 0)
    ? _items.concat(Items)
    : _items

  if (stopOnLimit && params.Limit && newItemsList.length >= params.Limit) return newItemsList

  if (LastEvaluatedKey) {
    return query({
      fields,
      params: {
        ...params,
        ExclusiveStartKey: LastEvaluatedKey
      },
      _items: newItemsList
    })
  }

  return newItemsList
}

const getAll = async ({ params, list, fields = [] }: { params: DynamodbParams, list: object[], fields?: string[] }): Promise<any[]> => {
  let idx = 0

  // ? Pack 25 requests at a time (batchGet limit)

  const packs: any = list.reduce((acc, param) => {
    if (acc[idx] && acc[idx].length >= 25) idx++

    if (!acc[idx]) acc[idx] = []

    acc[idx].push({ ...param })

    return acc
  }, [])

  const data = await Promise.all(packs.map(keys => {
    const opts = {
      RequestItems: {
        [params.TableName]: {
          Keys: keys,
          ...mountProjectionExpression({ fields })
        }
      }
    }

    return dbClient.doc().batchGet(opts)
      .promise()
      .then(({ Responses }) => Responses[params.TableName])
  }))

  return data.reduce((acc: any, i) => acc.concat(i), [])
}

const put = async ({ params }: { params: DynamodbParams }): Promise<object> => {
  try {
    await dbClient.doc().put(params).promise()

    return {}
  } catch (err) {
    if (err && err.code === 'ConditionalCheckFailedException') return {}
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw error(500, err.message)
  }
}

const update = async ({ params }: { params: DynamodbParams }): Promise<any> => {
  try {
    await dbClient.doc().update(params).promise()
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw error(500, err.message)
  }
}

const deleteOne = async ({ params }: { params: DynamodbParams }): Promise<object> => {
  try {
    await dbClient.doc().delete(params).promise()

    return params.Key
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
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

const deleteAll = async (params: DynamodbParams[] = []): Promise<object[]> => {
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

const executeBatch = async (packs: object[] = []): Promise<void> => {
  const results = await Promise.all(packs.map(pack => dbClient.doc().batchWrite(pack).promise()))

  const newPacks = getUnprocessedItems(results)

  if (Array.isArray(newPacks) && newPacks.length > 0) { await executeBatch(newPacks) }
}

const getUnprocessedItems = async (responseBatch: DynamodbResponseBatch[]): Promise<object[]> => {
  let idx = 0

  return responseBatch.reduce((acc: any, value) => {
    if (!isObject(value) || !isObject(value.UnprocessedItems)) return acc

    // ? Our batches use only 1 table each time
    const tableName = Object.keys(value.UnprocessedItems)[0]

    // ? there is no unprocessed item
    if (!tableName) return acc

    const processList = value.UnprocessedItems[tableName]

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
}: { object: object, removeAttributes?: string[], params: DynamodbParams }): Promise<any> => {
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

    const updateParams = {
      ...params,
      UpdateExpression,
      ExpressionAttributeValues,
      ExpressionAttributeNames,
      ReturnValues: 'UPDATED_NEW'
    }

    return await dbClient.doc().update(updateParams).promise()
  } catch (err) {
    if (err && err.code === 'ConditionalCheckFailedException') return {}
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
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

const mountProjectionExpression = ({ fields = [], options }: { fields?: string[], options?: DynamodbParams }): object => {
  if (fields.length > 0) {
    const ProjectionExpression = fields.map((_, index) => `#Projection_${index}`).join(',')
    const { ExpressionAttributeNames = {} } = options ?? {}

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
