import { CrudHttpMethods } from '.'

export interface Error {
  status?: number
  statusCode?: number
  error?: any
  message?: string
}

export interface lambdaParameters {
  port?: string
  region?: string
  httpMethod?: string
  functionName: string
  invocationType?: string
  headers?: {[key: string]: any}
  body?: {[key: string]: any}
  pathParameters?: {[key: string]: any}
  queryStringParameters?: {[key: string]: any}
  isOffline?: boolean
  serviceSecretArn?: string
}

export type CrudInputParams = {
  httpMethod: CrudHttpMethods
  sort?: string
  limit?: string
  page?: string
  columns?: string
  onlyCount?: boolean
  entity?: {[key: string]: any}
  filters?: {[key: string]: any}
  keys?: {[key: string]: any}
  customParameters?: {[key: string]: any}
}

export interface AccessKey {
  accessKeyId?: string
  secretAccessKey?: string
  region?: string
}
