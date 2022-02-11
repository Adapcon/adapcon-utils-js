import { CrudInputParams } from '..'
import { BasicOperators } from 'dynamoose/dist/Condition'

export interface DynamoObjectKeys {
  hash: string
  range?: string
}

export interface DynamooseInputIndexes {
  hash: string[]
  range?: string[]
}

export type DynamooseOutputParams<dynamooseParamsType = {}> = {
  method: 'get' | 'create' | 'update' | 'delete' | 'query'
  dynamooseData: dynamooseParamsType
}

export type PromiseOrValue<Value> = Promise<Value> | Value

export interface DynamooseEventsCrud {
  onPost?: DynamooseEventFunctionType
  onPut?: DynamooseEventFunctionType
  onDelete?: DynamooseEventFunctionType
  onGet?: DynamooseEventFunctionType
}

export type DynamooseEventFunctionType = (crudInputParams: DynamooseCrudInputParams) => PromiseOrValue<DynamooseCrudInputParams>

export type DynamooseQueryParams = keyof BasicOperators

export type DynamooseCrudInputParams = CrudInputParams & {
  sort?: 'ascending' | 'descending'
  keys: object
  filters?: object | string
}
