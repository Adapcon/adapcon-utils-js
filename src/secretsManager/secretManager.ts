import { SecretsManager } from '@aws-sdk/client-secrets-manager'
import { AccessKey, AccessKeyParam } from '.'

export const SecretManager = {
  getValue: async ({ region = 'sa-east-1', secretId }) => {
    const client = new SecretsManager({ region })

    // The SDK can also return a promise calling `promise`
    const secret = await client.getSecretValue({ SecretId: secretId })

    if (!secret) throw new Error('Secret not found!')
    if (!secret.SecretString) throw new Error('Secret without a value!')

    return secret as any as AccessKey
  },

  getAccessKey: async ({ region, serviceSecretArn: secretId, isOffline }: AccessKeyParam): Promise<AccessKey|{}> => {
    return (secretId && !isOffline)
      ? await SecretManager.getValue({
        region,
        secretId
      })
      : {}
  }
}
