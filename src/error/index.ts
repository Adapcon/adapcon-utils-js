import { isString } from '../string'

export const error = (statusCode: number, err: any): object => ({
  statusCode,
  ...(!isString(err) ? { error: err } : { message: err })
})
