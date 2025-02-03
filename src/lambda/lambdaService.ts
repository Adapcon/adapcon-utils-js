import { Lambda, LambdaClientConfig } from '@aws-sdk/client-lambda'

import { formattedResponse } from './formatters'
import { SecretManager } from '../secretsManager'
import { lambdaParameters, InvokeType } from '.'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class LambdaService {
  static async invoke<T>(lambdaParameters: lambdaParameters) {
    try {
      return executeInvoke<T>({
        ...lambdaParameters,
        ...(await SecretManager.getAccessKey(lambdaParameters))
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
  isDocker = false,
  httpMethod = '',
  path,
  requestContext = {},
  shouldStringifyBody
}: {
  accessKeyId?: string
  secretAccessKey?: string
} & lambdaParameters) => {
  const lambdaSettings: LambdaClientConfig = getLambdaConfig(region, accessKeyId, secretAccessKey, isOffline, port, isDocker)
  const lambda = new Lambda(lambdaSettings)

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
  })

  if (invocationType === InvokeType.Event) return { StatusCode: response.StatusCode }

  return formattedResponse<T>(response)
}

const getLambdaConfig = (
  region: string,
  accessKeyId: string | undefined,
  secretAccessKey: string | undefined,
  isOffline: boolean,
  port: string,
  isDocker: boolean
) => {
  const lambdaSettings: LambdaClientConfig = { region }
  if (accessKeyId && secretAccessKey) {
    lambdaSettings.credentials = {
      accessKeyId,
      secretAccessKey
    }
  }
  if (isOffline) {
    lambdaSettings.region = 'localhost'
    lambdaSettings.endpoint = isDocker ? `http://host.docker.internal:${port}` : `http://localhost:${port}`
  }

  return lambdaSettings
}
