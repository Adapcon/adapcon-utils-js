export interface DynamodbParams {
  TableName: any
  Key?: any
  Limit?: number
  ExclusiveStartKey?: object
  ExpressionAttributeNames?: object
  Item?: object
}

export interface DynamodbResponseBatch {
  UnprocessedItems: object
}
