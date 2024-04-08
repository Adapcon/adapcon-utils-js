import { AttributeValue } from '@aws-sdk/client-dynamodb'

export enum ConditionsExpressions {
  EQUAL = '=',
  NOT_EQUAL = '<>',
  LESS_THAN = '<',
  LESS_THAN_OR_EQUAL = '<=',
  GREATER_THAN = '>',
  GREATER_THAN_OR_EQUAL = '>=',
  BETWEEN = 'Between',
  BEGGINS_WITH = 'Begins with',
  EXISTS = 'Exists',
  NOT_EXISTS = 'Not exists',
  CONTAINS = 'Contains',
  NOT_CONTAINS = 'Not contains'
}

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

export type ScanOutput<T> = { Items: T[] | undefined, LastEvaluatedKey: Record<string, AttributeValue> | undefined }
