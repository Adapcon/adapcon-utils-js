import { isString } from '../string'

export * from './customErrors'

export const error = (statusCode: number, err: any): object => ({
  statusCode,
  ...(!isString(err) ? { error: err } : { message: err })
})
