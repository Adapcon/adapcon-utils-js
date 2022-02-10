export interface Error {
  status?: number
  statusCode?: number
  error?: any
  message?: string
}

export interface lambdaParameters {
  port?: string
  region?: string
  functionName: string
  invocationType?: string
  headers?: {[key: string]: any}
  body?: {[key: string]: any}
  pathParameters?: {[key: string]: any}
  queryStringParameters?: {[key: string]: any}
  isOffline?: boolean
}

export type CrudInputParams = {
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE'
  sort?: 'ascending' | 'descending'
  limit?: string
  page?: string
  columns?: string
  onlyCount?: boolean
  entity?: {[key: string]: any}
  filters?: {[key: string]: any}
  keys?: {[key: string]: any}
  customParameters?: {[key: string]: any}
}
