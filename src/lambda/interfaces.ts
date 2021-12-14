export interface LambdaErrors {
  app?: string
  auth?: string
  param?: string
}

export interface LambdaResp {
  statusCode: (number|undefined)
  message?: string
  body?: object
}
