import { SecretsManager } from '@aws-sdk/client-secrets-manager'
import { AccessKeyParam } from '.'

export const SecretManager = {
  getValue: async <T>({ region = 'sa-east-1', secretId }) => {
    const client = new SecretsManager({ region })

    // The SDK can also return a promise calling `promise`
    const secret = await client.getSecretValue({ SecretId: secretId })

    if (!secret) throw new Error('Secret not found!')
    if (!secret.SecretString) throw new Error('Secret without a value!')

    return JSON.parse(secret.SecretString) as T
  },

  getAccessKey: async <T>({ region, serviceSecretArn: secretId, isOffline }: AccessKeyParam): Promise<T|object> => {
    return (secretId && !isOffline)
      ? await SecretManager.getValue({
        region,
        secretId
      })
      : {}
  }
}
