import { DynamooseEventsCrud, DynamooseQueryParams } from '.'
import {
  HttpStatuses,
  capitalizeFirstLetter
} from '..'
import {
  DynamoObjectKeys,
  DynamooseCrudInputParams,
  DynamooseOutputParams,
  DynamooseEventFunctionType,
  DynamooseInputIndexes
} from './interfaces'
import { ModelType } from 'dynamoose/dist/General'
import { Document } from 'dynamoose/dist/Document'
import { QueryResponse } from 'aws-sdk/clients/timestreamquery'

export const dynamooseCrudHandler = async (
  crudInputParams: DynamooseCrudInputParams,
  dynamoObjectKeys: DynamoObjectKeys,
  events?: DynamooseEventsCrud
): Promise<DynamooseOutputParams> => {
  switch (crudInputParams.httpMethod) {
    case 'POST':
      return postDefaultFunction(crudInputParams, dynamoObjectKeys, events?.onPost)

    case 'PUT':
      return putDefaultFunction(crudInputParams, dynamoObjectKeys, events?.onPut)

    case 'DELETE':
      return deleteDefaultFunction(crudInputParams, dynamoObjectKeys, events?.onDelete)

    case 'GET':
      return getDefaultFunction(crudInputParams, dynamoObjectKeys, events?.onGet)
  }
}

const assembleEntityData = (
  crudInputParams: DynamooseCrudInputParams,
  dynamoObjectKeys: DynamoObjectKeys
) => {
  return {
    ...crudInputParams.entity,
    [dynamoObjectKeys.hash]: crudInputParams.keys[dynamoObjectKeys.hash],
    ...(dynamoObjectKeys.range ? { [dynamoObjectKeys.range]: crudInputParams.keys[dynamoObjectKeys.range] } : {})
  }
}

const assembleEntityKeys = (
  crudInputParams: DynamooseCrudInputParams,
  dynamoObjectKeys: DynamoObjectKeys
) => {
  return {
    [dynamoObjectKeys.hash]: crudInputParams.keys[dynamoObjectKeys.hash],
    ...(dynamoObjectKeys.range ? { [dynamoObjectKeys.range]: crudInputParams.keys[dynamoObjectKeys.range] } : {})
  }
}

const postDefaultFunction = async (
  crudInputParams: DynamooseCrudInputParams,
  dynamoObjectKeys: DynamoObjectKeys,
  event?: DynamooseEventFunctionType
): Promise<DynamooseOutputParams> => {
  const updatedCrudInputParams: DynamooseCrudInputParams = event ? await event(crudInputParams) : crudInputParams

  return {
    method: 'create',
    dynamooseData: assembleEntityData(updatedCrudInputParams, dynamoObjectKeys)
  }
}

const putDefaultFunction = async (
  crudInputParams: DynamooseCrudInputParams,
  dynamoObjectKeys: DynamoObjectKeys,
  event?: DynamooseEventFunctionType
): Promise<DynamooseOutputParams> => {
  const updatedCrudInputParams: DynamooseCrudInputParams = event ? await event(crudInputParams) : crudInputParams

  return {
    method: 'update',
    dynamooseData: assembleEntityData(updatedCrudInputParams, dynamoObjectKeys)
  }
}

const deleteDefaultFunction = async (
  crudInputParams: DynamooseCrudInputParams,
  dynamoObjectKeys: DynamoObjectKeys,
  event?: DynamooseEventFunctionType
): Promise<DynamooseOutputParams> => {
  const updatedCrudInputParams: DynamooseCrudInputParams = event ? await event(crudInputParams) : crudInputParams

  return {
    method: 'delete',
    dynamooseData: assembleEntityKeys(updatedCrudInputParams, dynamoObjectKeys)
  }
}

const getDefaultFunction = async (
  crudInputParams: DynamooseCrudInputParams,
  dynamoObjectKeys: DynamoObjectKeys,
  event?: DynamooseEventFunctionType
): Promise<DynamooseOutputParams> => {
  const updatedCrudInputParams: DynamooseCrudInputParams = event ? await event(crudInputParams) : crudInputParams

  const { filters } = crudInputParams
  // const returnObject: DynamooseOutputParams =
  return {
    method: filters ? 'query' : 'get',
    dynamooseData: assembleEntityKeys(updatedCrudInputParams, dynamoObjectKeys)
  }
}

export const dynamooseQueryBuilder = (
  requestFilters: {[key: string]: DynamooseQueryParams},
  requestKeys: {[key: string]: string},
  dynamoObjectKeys: DynamoObjectKeys
): {} => {
  let queryObject = { [dynamoObjectKeys.hash]: { [requestFilters[dynamoObjectKeys.hash]]: requestKeys[dynamoObjectKeys.hash] } }

  if (dynamoObjectKeys.range && requestKeys[dynamoObjectKeys.range]) {
    queryObject = {
      ...queryObject,
      ...{ [dynamoObjectKeys.range]: { [requestFilters[dynamoObjectKeys.range]]: requestKeys[dynamoObjectKeys.range] } }
    }
  }
  return queryObject
}

export const prepareDynamoIndexes = (
  indexes: DynamooseInputIndexes,
  indexNameConcatString?: string
): DynamoObjectKeys => {
  const hashIndexes: string[] = []
  const rangeIndexes: string[] = []
  indexes.hash.forEach((indexName, indexPosition) => {
    indexPosition !== 0 ? hashIndexes.push(capitalizeFirstLetter(indexName)) : hashIndexes.push(indexName)
  })

  if (indexes.range) {
    indexes.range.forEach((indexName, indexPosition) => {
      indexPosition !== 0 ? rangeIndexes.push(capitalizeFirstLetter(indexName)) : rangeIndexes.push(indexName)
    })
  }

  return {
    hash: hashIndexes.join(indexNameConcatString ?? ''),
    ...(rangeIndexes.length ? { range: rangeIndexes.join(indexNameConcatString ?? '') } : '')
  }
}

export const mountDynamooseQuery = <T extends Document>(crudInputParams: DynamooseCrudInputParams, dynamoObjectKeys: DynamoObjectKeys, dynamooseModel: ModelType<T>) => {
  const { keys, filters }: {[key: string]: any} = crudInputParams

  const condition = dynamooseQueryBuilder(filters, keys, dynamoObjectKeys)
  const query = dynamooseModel.query(condition)
  if (crudInputParams.limit) { query.settings = { ...query.settings, limit: Number(crudInputParams.limit) } }
  if (crudInputParams.page) { query.settings = { ...query.settings, startAt: JSON.parse(crudInputParams.page) } }
  if (crudInputParams.sort) { query.settings = { ...query.settings, sort: crudInputParams.sort } }
  if (crudInputParams.onlyCount === true) { query.settings = { ...query.settings, count: true } }
  return query
}

export const getDynamooseStatusCode = <dynamooseEntity>(method: DynamooseOutputParams['method'], dynamooseResult: dynamooseEntity | null | QueryResponse): {
  statusCode: HttpStatuses
  result: dynamooseEntity | null | {data: dynamooseEntity[], lastKey: object}
} => {
  switch (method) {
    case 'create':
      return {
        statusCode: HttpStatuses.created,
        result: dynamooseResult as dynamooseEntity
      }
    case 'delete':
      return {
        statusCode: HttpStatuses.accepted,
        result: dynamooseResult as dynamooseEntity
      }
    case 'update':
      return {
        statusCode: HttpStatuses.accepted,
        result: dynamooseResult as dynamooseEntity
      }
    case 'get':
      return {
        statusCode: HttpStatuses.accepted,
        result: dynamooseResult as dynamooseEntity
      }
    case 'query':
    {
      const data = dynamooseResult as unknown as dynamooseEntity[]
      const lastKey = (dynamooseResult as unknown as {lastKey: object}).lastKey
      return {
        statusCode: HttpStatuses.success,
        result: { data, lastKey }
      } }
  }
}
