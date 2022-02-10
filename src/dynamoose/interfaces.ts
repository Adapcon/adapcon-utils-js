import { CrudInputParams } from '..'
import {BasicOperators} from 'dynamoose/dist/Condition'

export interface DynamoObjectKeys {
  hash: string
  range?: string
}

export interface DynamooseInputIndexes {
  hash: string[]
  range?: string[]
}

export type DynamooseOutputParams<dynamooseParamsType = {}> = {
  method?: 'get' | 'create' | 'update' | 'delete' | 'query'
  dynamooseData: dynamooseParamsType
}

type PromiseOrValue<Value> = Promise<Value> | Value

export interface DynamooseEventsCrud {
  onPost?: PromiseOrValue<DynamooseEventFunctionType>
  onPut?: PromiseOrValue<DynamooseEventFunctionType>
  onDelete?: PromiseOrValue<DynamooseEventFunctionType>
  onGet?: PromiseOrValue<DynamooseEventFunctionType>
}

export type DynamooseEventFunctionType = (crudInputParams: CrudInputParams) => CrudInputParams

export type DynamooseQueryParams = keyof BasicOperators
