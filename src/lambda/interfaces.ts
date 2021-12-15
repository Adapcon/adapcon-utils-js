export interface Error {
  status?: number
  statusCode?: number
  error?: any
  message?: string
}
export interface Event {
    body: any
    headers: object
    httpMethod: string
    isBase64Encoded: boolean
    multiValueHeaders: object
    multiValueQueryStringParameters: object
    path: string
    pathParameters: object
    queryStringParameters: object
    requestContext: object
    resource: string
    stageVariables: object
}
  
  
