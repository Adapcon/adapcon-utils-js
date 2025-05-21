import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"

export function getDynamoDBClient() {
  const dynamoInstance = new DynamoDBClient({
    ...(process.env.IS_OFFLINE ? {
      endpoint: 'http://localhost:8000',
      region: 'localhost'
    } : {})
  })

  const client = DynamoDBDocument.from(dynamoInstance, {
    marshallOptions: { removeUndefinedValues: true }
  })

  return client
}
