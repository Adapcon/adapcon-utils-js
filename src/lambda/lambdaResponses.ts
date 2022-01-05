import { isNumber } from '../number'
import { objToStr } from '../object'
import { ProxyResult } from 'aws-lambda'
import type { Error } from './interfaces'

export const lambdaResp = (statusCode: number, body?: object | string): ProxyResult => ({
  statusCode,
  ...(body ? { body: objToStr(body) } : { body: '' })
})

export const lambdaRespError = (err: Error): ProxyResult => {
  err.statusCode = err.status ?? err.statusCode
  err.message = err.error ?? err.message

  if (err && isNumber(err.statusCode)) return lambdaResp(Number(err.statusCode), (err.message) ? { error: err.message } : undefined)

  return lambdaResp(500, (err.message) ? { error: err.message } : undefined)
}
