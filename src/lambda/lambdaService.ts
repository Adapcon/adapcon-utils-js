import AWS from 'aws-sdk'

import { formattedResponse } from './formatters'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class LambdaService {
  static async invoke ({
    port = '',
    region = 'sa-east-1',
    functionName,
    invocationType = 'RequestResponse',
    headers = {},
    body = {},
    pathParameters = {},
    queryStringParameters = {},
    isOffline = false
  }: {
    port?: string
    region?: string
    functionName: string
    invocationType?: string
    headers?: object
    body?: object
    pathParameters?: object
    queryStringParameters?: object
    isOffline?: boolean
  }): Promise<object> {
    try {
      const lambda = new AWS.Lambda({
        region,
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
            body,
            pathParameters,
            queryStringParameters
          })
        )
      }).promise()

      return formattedResponse(response)
    } catch (error) {
      console.log('Error LambdaService invoke', error)
      throw error
    }
  }
};
