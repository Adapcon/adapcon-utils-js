export interface SqlOperators {
  columnName: string
  value: string[] | string
}

export interface SqlWhere {
  [key: string]: string | number | boolean
}

export interface SqlErrorParameters {
  code: number
  message: string
  sql: string
  stack: string
}

export interface SqlErrorResponse { statusCode: number, error: {} }
