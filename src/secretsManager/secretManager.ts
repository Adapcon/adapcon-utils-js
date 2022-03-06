import AWS from 'aws-sdk'
import { AccessKey, AccessKeyParam } from '.'

export const SecretManager = {
  getValue: async ({ region = 'sa-east-1', secretId }) => {
    const client = new AWS.SecretsManager({ region })

    // The SDK can also return a promise calling `promise`
    const secret = await client.getSecretValue({ SecretId: secretId }).promise()

    if (!secret) throw new Error('Secret not found!')
    if (!secret.SecretString) throw new Error('Secret without a value!')

    return JSON.parse(secret.SecretString ?? '{}')
  },

  getAccessKey: async ({ region, serviceSecretArn: secretId }: AccessKeyParam): Promise<AccessKey> => {
    return secretId
      ? await SecretManager.getValue({
        region,
        secretId
      })
      : {}
  }
}
