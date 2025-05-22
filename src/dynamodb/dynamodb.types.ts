import { QueryCommandInput } from "@aws-sdk/lib-dynamodb"

export interface IDynamoDBFactory<T, K> {
  put(item: T): Promise<T>
  delete(keys: K): Promise<void>
  get<Fields extends ProjectionFields<T> | undefined>(
    keys: K,
    projection?: Fields
  ): Promise<ProjectedResult<T, Fields> | undefined>
  query(params: QueryCommandInput): Promise<QueryResponse<T>>
}

export type Recordable = Record<string, any>

export type TableKeys = Record<string, any>

export type ProjectionFields<T> = readonly (keyof T & string)[]

export type ProjectedResult<T, Fields extends ProjectionFields<T> | undefined> =
  Fields extends ProjectionFields<T> ? Pick<T, Fields[number]> : T

export type QueryResponse<T> = {
  items: T[],
  lastKey?: Record<string, any>,
  count?: number
}
