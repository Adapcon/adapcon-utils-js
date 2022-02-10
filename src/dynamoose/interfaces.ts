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
  method?: 'get' | 'create' | 'update' | 'delete' | 'query'
  dynamooseData: dynamooseParamsType
}

export interface DynamooseEventsCrud {
  onPost?: DynamooseEventFunctionType | Promise<DynamooseEventFunctionType>
  onPut?: DynamooseEventFunctionType | Promise<DynamooseEventFunctionType>
  onDelete?: DynamooseEventFunctionType | Promise<DynamooseEventFunctionType>
  onGet?: DynamooseEventFunctionType | Promise<DynamooseEventFunctionType>
}

export type DynamooseEventFunctionType = (crudInputParams: CrudInputParams) => CrudInputParams

export type DynamooseQueryParams = 'eq' | 'lt' | 'le' | 'gt' | 'ge' | 'beginsWith' | 'contains' | 'in' | 'between'
