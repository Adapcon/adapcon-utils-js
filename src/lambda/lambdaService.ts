import AWS from 'aws-sdk'

import { formattedResponse } from './formatters'
import { SecretManager } from './../secretsManager'
import { lambdaParameters, InvokeType } from '.'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class LambdaService {
  static async invoke<T>(lambdaParameters: lambdaParameters) {
    try {
      return executeInvoke<T>({
        ...lambdaParameters,
        ...await SecretManager.getAccessKey(lambdaParameters)
      })
    } catch (error) {
      console.log('Error LambdaService invoke', error)
      throw error
    }
  }
}

const executeInvoke = async <T>({
  accessKeyId,
  secretAccessKey,
  port = '',
  region = 'sa-east-1',
  functionName,
  invocationType = InvokeType.RequestResponse,
  headers = {},
  body = {},
  pathParameters = {},
  queryStringParameters = {},
  multiValueQueryStringParameters = {},
  isOffline = false,
  httpMethod = '',
  path,
  requestContext = {},
  shouldStringifyBody
}: {
  accessKeyId?: string
  secretAccessKey?: string
} & lambdaParameters) => {
  const lambda = new AWS.Lambda({
    region,
    accessKeyId,
    secretAccessKey,
    ...(isOffline
      ? {
          region: 'localhost',
          endpoint: `http://localhost:${port}`
        }
      : {})
  })

  const response = await lambda.invoke({
    FunctionName: functionName,
    InvocationType: invocationType,
    Payload: Buffer.from(
      JSON.stringify({
        headers,
        body: shouldStringifyBody ? JSON.stringify(body) : body,
        httpMethod,
        pathParameters,
        queryStringParameters,
        multiValueQueryStringParameters,
        path,
        requestContext,
        multiValueHeaders: Object.entries(headers).reduce((previous, current) => {
          const [header, value] = current
          previous[header] = [value]
          return previous
        }, {})
      })
    )
  }).promise()

  return formattedResponse<T>(response)
}
