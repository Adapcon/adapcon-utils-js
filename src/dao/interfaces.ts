export interface DynamodbParams {
  TableName: any
  Key?: any
  Limit?: number
  ExclusiveStartKey?: object
  ExpressionAttributeNames?: object
  ExpressionAttributeValues?: object
  KeyConditionExpression?: string
  Item?: object
}

export interface DynamodbResponseBatch {
  UnprocessedItems: object
}
