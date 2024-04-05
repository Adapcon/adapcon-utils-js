import { isNumber } from '../number'
import { objToStr } from '../object'
import type { Error, Headers } from './interfaces'

export const lambdaResp = (statusCode: number, body?: object | string, headers?: Headers) => ({
  statusCode,
  ...(body ? { body: objToStr(body) } : { body: '' }),
  ...(headers ? { headers } : null)
})

export const lambdaRespError = (err: Error) => {
  err.statusCode = err.status ?? err.statusCode
  err.message = err.error ?? err.message

  if (err && isNumber(err.statusCode)) return lambdaResp(Number(err.statusCode), (err.message) ? { error: err.message } : undefined)

  return lambdaResp(500, (err.message) ? { error: err.message } : undefined)
}

export const lambdaProcessError = <T>({
  type = 'session', functionName, context, err
}) => {
  console.error(`${type} ${functionName as string} - ERROR: `, err)
  const metadata = { logStreamName: context?.logStreamName, functionName }

  if (err.statusCode) {
    const errorResponse: {
      $metadata: { logStreamName: string, functionName: string }
      message?: string
      error?: string | number | object | boolean | null | undefined | T
    } = { $metadata: metadata }

    if (err.message) errorResponse.message = err.message
    if (err.error) errorResponse.error = err.error

    return lambdaResp(err.statusCode, errorResponse)
  }

  return lambdaRespError({ error: { $metadata: metadata, message: 'Internal Server Error' } })
}
