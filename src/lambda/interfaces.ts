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
export type DocfySettings = {
  label: string
  description?: string
  required?: boolean
  translate?: string
  default?: any
}

export type Docfy = {
  type: 'screen' | 'integration' | 'public' | 'session' | 'hybrid'
  description: string
  pathParameters?: { [key: string]: Omit<DocfySettings, 'required'> }
  queryStringParameters?: { [key: string]: DocfySettings }
  headers?: { [key: string]: DocfySettings }
  body?: { [key: string]: DocfySettings }
  requestContext?: { [key: string]: DocfySettings }
  fromEvent?: { [key: string]: DocfySettings }
}
