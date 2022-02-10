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

const postDefaultFunction = async (
  crudInputParams: DynamooseCrudInputParams,
  dynamoObjectKeys: DynamoObjectKeys,
  event?: DynamooseEventFunctionType
): Promise<DynamooseOutputParams> => {
  const updatedCrudInputParams: DynamooseCrudInputParams = event ? await event?.(crudInputParams) : crudInputParams

  return {
    method: 'create',
    dynamooseData: {
      ...updatedCrudInputParams.entity,
      [dynamoObjectKeys.hash]: updatedCrudInputParams?.keys?.[dynamoObjectKeys.hash],
      [dynamoObjectKeys.range!]: updatedCrudInputParams?.keys?.[dynamoObjectKeys.range!]
    }
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
    dynamooseData: {
      ...updatedCrudInputParams.entity,
      [dynamoObjectKeys.hash]: updatedCrudInputParams?.keys?.[dynamoObjectKeys.hash],
      [dynamoObjectKeys.range!]: updatedCrudInputParams?.keys?.[dynamoObjectKeys.range!]
    }
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
    dynamooseData: {
      [dynamoObjectKeys.hash]: updatedCrudInputParams?.keys?.[dynamoObjectKeys.hash],
      [dynamoObjectKeys.range!]: updatedCrudInputParams?.keys?.[dynamoObjectKeys.range!]
    }
  }
}

const getDefaultFunction = async (
  crudInputParams: DynamooseCrudInputParams,
  dynamoObjectKeys: DynamoObjectKeys,
  event?: DynamooseEventFunctionType
): Promise<DynamooseOutputParams> => {
  const updatedCrudInputParams: DynamooseCrudInputParams = event ? await event(crudInputParams) : crudInputParams

  const returnObject: DynamooseOutputParams = {
    dynamooseData: {}
  }

  returnObject.method = (crudInputParams?.filters?.length ? 'query' : 'get')
  returnObject.dynamooseData = {
    [dynamoObjectKeys.hash]: updatedCrudInputParams?.keys?.[dynamoObjectKeys.hash],
    ...(dynamoObjectKeys.range ? { [dynamoObjectKeys.range]: updatedCrudInputParams?.keys?.[dynamoObjectKeys.range] } : '')
  }
  return returnObject
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
  if (!crudInputParams?.filters?.length && !Object.keys(keys).length) { throw new Error('invalid filters sent') }

  const condition = dynamooseQueryBuilder(JSON.parse(filters), keys, dynamoObjectKeys)
  const query = dynamooseModel.query(condition)
  if (crudInputParams.limit) { query.limit(Number(crudInputParams.limit)) }
  if (crudInputParams?.customParameters?.gsi?.length) { query.using(crudInputParams.customParameters.gsi) }
  if (crudInputParams.page) { query.startAt(JSON.parse(crudInputParams.page)) }
  if (crudInputParams.sort) { query.sort(crudInputParams.sort) }
  if (crudInputParams.onlyCount === true) { query.count() }
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
    default:
      return {
        statusCode: HttpStatuses.notImplemented,
        result: null
      }
  }
}
