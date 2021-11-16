import { isNumber } from '../number'
import { objToStr } from '../object'
import { ProxyResult } from 'aws-lambda'
interface Error {
  status?: number
  statusCode?: number
  error?: any
  message?: string
}

export const formattedResponse = ({ StatusCode, Payload }: { StatusCode?: any, Payload?: any }): object => {
  const payloadFormatted = JSON.parse(Payload || '{}')

  return {
    status: payloadFormatted.statusCode || StatusCode,
    body: payloadFormatted.body ? JSON.parse(payloadFormatted.body) : {}
  }
}

export const lambdaResp = (statusCode: number, body?: object | string): ProxyResult => ({
  statusCode,
  ...(body ? { body: objToStr(body) } : { body: '' })
})

export const lambdaRespError = (err: Error): ProxyResult => {
  err.statusCode = err.status || err.statusCode
  err.message = err.error || err.message

  if (err && isNumber(err.statusCode)) return lambdaResp(err.statusCode || 500, (err.message) ? { error: err.message } : undefined)

  return lambdaResp(500, (err.message) ? { error: err.message } : undefined)
}
