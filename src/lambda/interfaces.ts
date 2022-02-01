export interface Error {
  status?: number
  statusCode?: number
  error?: any
  message?: string
}

export interface lambdaParameters {
  port?: ''
  region?: 'sa-east-1'
  functionName: string
  invocationType?: 'RequestResponse'
  headers?: {}
  body?: {}
  pathParameters?: {}
  queryStringParameters?: {}
  isOffline?: false
}
