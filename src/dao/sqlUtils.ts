import { isObject } from '../object'
import { Operators, SqlErr, SqlError, Where } from './interfaces'

const sqlError = (err: SqlErrorParameters): SqlErrorResponse => {
  const obj = {
    code: err.code,
    message: err.message,
    sql: err.sql,
    stack: err.stack
  }

  if (process.env.IS_OFFLINE) {
    obj.sql = err.sql
    obj.stack = err.stack
    console.error('SQL ERROR:', obj)
  }

  return { statusCode: 500, error: obj }
}

const normalizeQuery = (query: string): string => query.replace(/(?:\\[rn]|[\r\n\t]+)+/g, ' ').replace(/  +/g, ' ').trim()

const stringifyStatement = (args: string, delimiter = ', '): string => {
  if (!args) return ''
  if (Array.isArray(args)) return args.join(delimiter)

  return args
}

const normalizeColumnName = (column: string, table: string): string => {
  const alreadyHasTable = column.includes('.')

  const [tableName, columnName] = (
    alreadyHasTable
      ? column.split('.')
      : [table, column]
  )

  return `${sqlQuote(tableName)}.${sqlQuote(columnName)}`
}

const sqlQuote = (arg: string): string => `\`${arg}\``

const operatorIN = ({ columnName, value }: Operators) => `${columnName} IN(${Array.isArray(value) ? value.map(() => '?').toString() : '?'})`

const operatorLIKE = ({ columnName, value }: Operators) => [...Array.isArray(value) ? value : [value]].map(() => `${columnName} LIKE ?`)

const sqlOperators = (): { IN: Function, LIKE: Function } => ({ IN: operatorIN, LIKE: operatorLIKE })

const normalizeLIKE = (values: string[] | string) => (Array.isArray(values) ? values.map(value => `%${value}%`) : `%${values}%`)

const sqlNormalizers = { LIKE: normalizeLIKE }

const normalizeSqlValues = (operator: string, values: string[] | string) => (sqlNormalizers[operator] ? sqlNormalizers[operator](values) : values)

const composeCondition = (column: string, condition: any, table: string) => {
  const operators = sqlOperators()
  const columnName = normalizeColumnName(column, table)

  const defaultReturn = { condition: `${columnName} = ?`, value: condition }

  if (!isObject(condition)) return defaultReturn

  const { operator, value } = condition

  if (operators[operator]) {
    return {
      condition: operators[operator]({ columnName, value }),
      value: normalizeSqlValues(operator, value)
    }
  }

  if (operator !== '') {
    return {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      condition: `${columnName} ${operator} ?`,
      value
    }
  }

  return defaultReturn
}

const composeConditions = (column: string, conditions: any, table: string) => {
  if (Array.isArray(conditions)) return conditions.map(condition => composeConditions(column, condition, table)).flat()

  return [composeCondition(column, conditions, table)]
}

const decomposeWhere = (where: Where, table: string) => Object.keys(where || {}).reduce((acc, key) => {
  const value = where[key]

  const conditions = composeConditions(key, value, table)

  return {
    conditions: [
      ...acc.conditions,
      ...(conditions.map(({ condition }) => condition).flat())
    ],
    values: [
      ...acc.values,
      ...(conditions.map(({ value }) => value).flat())
    ]
  }
}, { conditions: [], values: [] })

export const sqlUtils = {
  sqlError,
  normalizeQuery,
  stringifyStatement,
  decomposeWhere,
  composeConditions,
  composeCondition,
  normalizeSqlValues,
  normalizeLIKE,
  sqlOperators,
  operatorLIKE,
  operatorIN,
  sqlQuote,
  normalizeColumnName
}
