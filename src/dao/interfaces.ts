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

export interface SqlOperators {
  columnName: string
  value: string[] | string
}

export interface SqlWhere {
  [key: string]: string
}

export interface SqlErrorParameters {
  code: number
  message: string
  sql: string
  stack: string
}

export interface SqlErrorResponse { statusCode: number, error: {} }
