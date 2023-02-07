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

export interface Operators {
  columnName: string
  value: string[] | string
}

export interface Where {
  [key: string]: string
}

export interface SqlErr {
  code: number
  message: string
  sql: string
  stack: string
}

export interface SqlError { statusCode: number, error: {} }
