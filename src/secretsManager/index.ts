import AWS from 'aws-sdk'

export const SecretManager = {
  getValue: async ({ region = 'sa-east-1', secretId }) => {
    const client = new AWS.SecretsManager({ region })

    // The SDK can also return a promise calling `promise`
    const secret = await client.getSecretValue({SecretId: secretId}).promise()

    if (!secret) throw new Error("Secret not found!")
    if (!secret.SecretString) throw new Error("Secret without a value!")

    return JSON.parse(secret.SecretString)
  }
}
