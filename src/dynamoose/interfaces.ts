import { CrudInputParams } from '..'

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

export type DynamooseQueryParams = 'and'
|'or'
|'not'
|'parenthesis'
|'group'
|'where'
|'filter'
|'attribute'
|'eq'
|'lt'
|'le'
|'gt'
|'ge'
|'beginsWith'
|'contains'
|'exists'
|'in'
|'between'

export type DynamooseCrudInputParams = CrudInputParams & {
  sort?: 'ascending' | 'descending'
  keys: object
  filters?: object | string
}
