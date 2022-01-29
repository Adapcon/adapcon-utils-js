import AWS from 'aws-sdk'

export const SecretManager = {
  getValue: async ({ region = 'sa-east-1', secretId }) => {
    const client = new AWS.SecretsManager({ region })

    return new Promise((resolve, reject) => {
      client.getSecretValue(
        { SecretId: secretId }, (err, data) => {
          if (err || !data?.SecretString) reject(err || 'no value founded')
          else resolve(JSON.parse(data?.SecretString))
        }
      )
    })
  }
}
