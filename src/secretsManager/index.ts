import AWS from 'aws-sdk'

export const SecretManager = {
  getValue: async ({ region = 'sa-east-1', SecretId }) => {
    const client = new AWS.SecretsManager({ region })

    return new Promise((resolve, reject) => {
      client.getSecretValue(
        { SecretId }, (err, data) => {
          if (err || !data?.SecretString) reject(err || 'no value founded')
          else resolve(JSON.parse(data?.SecretString))
        }
      )
    })
  }
}
