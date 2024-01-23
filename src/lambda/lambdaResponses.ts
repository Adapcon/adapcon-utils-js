import { isNumber } from '../number'
import { objToStr } from '../object'
import { ProxyResult } from 'aws-lambda'
import type { Error, Headers } from './interfaces'

export const lambdaResp = (statusCode: number, body?: object | string, headers?: Headers): ProxyResult => ({
  statusCode,
  ...(body ? { body: objToStr(body) } : { body: '' }),
  ...(headers ? { headers } : null)
})

export const lambdaRespError = (err: Error): ProxyResult => {
  err.statusCode = err.status ?? err.statusCode
  err.message = err.error ?? err.message

  if (err && isNumber(err.statusCode)) return lambdaResp(Number(err.statusCode), (err.message) ? { error: err.message } : undefined)

  return lambdaResp(500, (err.message) ? { error: err.message } : undefined)
}
