import { isNumber } from '../number'
import { objToStr, isObject } from '../object'
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
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  err.statusCode = err.status || err.statusCode
  err.message = err.error || err.message

  if (err && isNumber(err.statusCode)) return lambdaResp(Number(err.statusCode), (err.message) ? { error: err.message } : undefined)

  return lambdaResp(500, (err.message) ? { error: err.message } : undefined)
}

export const getBody = (event: { body: string } | string | any, defaultValue: any = null): object | any => {
  try {
    if (!isObject(event)) throw new Error('Event is not an object')

    if (typeof event.body === 'string') return JSON.parse(event.body)

    if (!isObject(event.body)) return defaultValue

    return event.body
  } catch (err) {
    return defaultValue
  }
}
