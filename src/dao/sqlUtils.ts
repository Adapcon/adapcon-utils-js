import { HttpStatuses } from '../http'
import { isObject } from '../object'
import { SqlOperators, SqlErrorParameters, SqlErrorResponse, SqlWhere } from './interfaces'

const sqlError = (err: SqlErrorParameters): SqlErrorResponse => ({
  statusCode: HttpStatuses.internalError,
  error: {
    code: err.code,
    message: err.message,
    sql: err.sql,
    stack: err.stack
  }
})

const normalizeQuery = (query: string): string => query.replace(/(?:\\[rn]|[\r\n\t]+)+/g, ' ').replace(/  +/g, ' ').trim()

const stringifyStatement = (args: string[] | string, delimiter = ', '): string => {
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

const operatorIN = ({ columnName, value }: SqlOperators) => `${columnName} IN(${Array.isArray(value) ? value.map(() => '?').toString() : '?'})`

const operatorLIKE = ({ columnName, value }: SqlOperators) => [...Array.isArray(value) ? value : [value]].map(() => `${columnName} LIKE ?`)

const sqlOperators = { IN: operatorIN, LIKE: operatorLIKE }

const normalizeLIKE = (values: string[] | string) => (Array.isArray(values) ? values.map(value => `%${value}%`) : `%${values}%`)

const sqlNormalizers = { LIKE: normalizeLIKE }

const normalizeSqlValues = (operator: string, values: string[] | string) => (sqlNormalizers[operator] ? sqlNormalizers[operator](values) : values)

const composeCondition = (column: string, condition: any, table: string) => {
  const columnName = normalizeColumnName(column, table)

  const defaultReturn = { condition: `${columnName} = ?`, value: condition }

  const { operator, value } = condition

  if (!isObject(condition) || !operator) return defaultReturn

  if (sqlOperators[operator]) {
    return {
      condition: sqlOperators[operator]({ columnName, value }),
      value: normalizeSqlValues(operator, value)
    }
  }

  return {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    condition: `${columnName} ${operator} ?`,
    value
  }
}

const composeConditions = (column: string, conditions: any, table: string) => {
  if (Array.isArray(conditions)) return conditions.map(condition => composeCondition(column, condition, table)).flat()

  return [composeCondition(column, conditions, table)]
}

const decomposeWhere = (where: SqlWhere, table: string) => Object.keys(where).reduce((acc, key) => {
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

const parseResponse = (resultSet: any[]) => {
  const resultMapped = resultSet.reduce((acc: any[], i: any) => {
    const newItem = { ...i }

    Object.entries(newItem).forEach(([key, value]) => {
      if (key.includes('.')) {
        set(newItem, key, value)
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete newItem[key]
      }
    })

    acc.push(newItem)
    return acc
  }, [])

  return resultMapped
}

const set = (obj: any, path: any, value: any) => {
  if (!isObject(obj)) return obj

  const arrayPath = (Array.isArray(path)
    ? path
    : path.toString().match(/[^.[\]]+/g) || []
  )

  if (!arrayPath.length) return obj

  // eslint-disable-next-line no-return-assign
  arrayPath.slice(0, -1).reduce((
    acc: any,
    curr: any,
    index: number
  ) => (acc[curr]
    ? acc[curr]
    : acc[curr] = Math.abs(arrayPath[index++]) >> 0 === +arrayPath[index++]
      ? []
      : {}
  ), obj)[arrayPath[arrayPath.length - 1]] = value

  return obj
}

const decomposeInsertObject = object => {
  const {
    keys,
    values
  } = decomposeObject(object)

  return {
    fields: keys.map(field => sqlQuote(field)),
    values
  }
}

const decomposeObject = (object = {}) => {
  if (!isObject(object)) return { keys: [], values: [] }

  return {
    keys: Object.keys(object),
    values: Object.values(object)
  }
}

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
  sqlNormalizers,
  operatorLIKE,
  operatorIN,
  sqlQuote,
  decomposeInsertObject,
  parseResponse,
  set,
  normalizeColumnName,
  decomposeObject
}
