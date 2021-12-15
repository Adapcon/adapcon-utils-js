import { isObject } from '../object'

export const formattedResponse = ({ StatusCode, Payload }: { StatusCode?: any, Payload?: any }): object => {
  const payloadFormatted = JSON.parse(Payload || '{}')

  return {
    status: payloadFormatted.statusCode || StatusCode,
    body: payloadFormatted.body ? JSON.parse(payloadFormatted.body) : {}
  }
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
