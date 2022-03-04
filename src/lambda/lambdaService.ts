import AWS from 'aws-sdk'

import { formattedResponse } from './formatters'
import { SecretManager } from './../secretsManager/index'
import { lambdaParameters, AccessKey } from '.'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class LambdaService {
  static async invoke (lambdaParameters: lambdaParameters): Promise<object> {
    try {
      const accessKey: AccessKey = lambdaParameters.serviceSecretArn
        ? await SecretManager.getValue({
          region: lambdaParameters.region,
          secretId: lambdaParameters.serviceSecretArn
        })
        : {}

      return executeInvoke({
        ...lambdaParameters,
        ...accessKey
      })
    } catch (error) {
      console.log('Error LambdaService invoke', error)
      throw error
    }
  }
}

const executeInvoke = async ({
  accessKeyId,
  secretAccessKey,
  port = '',
  region = 'sa-east-1',
  functionName,
  invocationType = 'RequestResponse',
  headers = {},
  body = {},
  pathParameters = {},
  queryStringParameters = {},
  isOffline = false,
  httpMethod = ''
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
        body,
        httpMethod,
        pathParameters,
        queryStringParameters
      })
    )
  }).promise()

  return formattedResponse(response)
}
