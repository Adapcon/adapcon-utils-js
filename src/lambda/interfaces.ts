import { CrudHttpMethods } from '.'

export interface Error {
  status?: number
  statusCode?: number
  error?: any
  message?: string
}

export type Headers = {
  [header: string]: string | number | boolean
}

export enum InvokeType {
  RequestResponse = 'RequestResponse',
  Event = 'Event',
  DryRun = 'DryRun',
}

export interface lambdaParameters {
  port?: string
  region?: string
  httpMethod?: string
  functionName: string
  invocationType?: InvokeType
  headers?: {[key: string]: any}
  body?: {[key: string]: any} | string
  pathParameters?: {[key: string]: any}
  queryStringParameters?: {[key: string]: any}
  multiValueQueryStringParameters?: {[key: string]: any}
  isOffline?: boolean
  serviceSecretArn?: string
  path?: string
  requestContext?: object
  shouldStringifyBody?: boolean
}

export type CrudInputParams = {
  httpMethod: CrudHttpMethods
  sort?: string
  limit?: string
  page?: string
  columns?: string
  onlyCount?: boolean
  entity?: {[key: string]: any}
  filters?: string
  keys?: {[key: string]: any}
  customParameters?: {[key: string]: any}
}
