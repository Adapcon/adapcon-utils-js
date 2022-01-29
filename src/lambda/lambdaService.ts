import AWS from 'aws-sdk'

import { formattedResponse } from './formatters'
import { SecretManager } from './../secretsManager/index'

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
    isOffline = false,
    serviceSecretArn = ''
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
    serviceSecretArn?: string
  }): Promise<object> {
    try {
      const awsLambdaSettings: {
        accessKeyId?: string
        secretAccessKey?: string
        region: string
      } = {
        region,
        ...(isOffline
          ? {
              region: 'localhost',
              endpoint: `http://localhost:${port}`
            }
          : {})
      }
      if (serviceSecretArn) {
        const secretValue: {
          accessKeyId?: string
          secretAccessKey?: string
        } = await SecretManager.getValue({ region, secretId: serviceSecretArn }) as {
          accessKeyId?: string
          secretAccessKey?: string
        }
        awsLambdaSettings.accessKeyId = secretValue.accessKeyId
        awsLambdaSettings.secretAccessKey = secretValue.secretAccessKey
      }
      const lambda = new AWS.Lambda(awsLambdaSettings)

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
