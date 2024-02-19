import jsonBigInt from 'json-bigint'

import { isObject } from '../object'

const ascii = new TextDecoder('ascii')

export const formattedResponse = <T>({ StatusCode, Payload }: { StatusCode?: number, Payload?: any }): { status: number, body: T } => {
  const payloadFormatted = Payload ? JSON.parse(ascii.decode(Payload)) : {}

  return {
    status: payloadFormatted.statusCode || StatusCode,
    body: payloadFormatted.body ? JSON.parse(payloadFormatted.body) : {},
    ...(payloadFormatted.headers ? { headers: payloadFormatted.headers } : null)
  }
}

export const getBody = (event: { body: string } | string | any, defaultValue: any = null): object | any => {
  try {
    if (!isObject(event)) throw new Error('Event is not an object')

    if (typeof event.body === 'string') return jsonBigInt.parse(event.body)

    if (!isObject(event.body)) return defaultValue

    return event.body
  } catch (err) {
    return defaultValue
  }
}
