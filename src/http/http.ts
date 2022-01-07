import { HttpMessages, HttpStatuses } from './enums'
import { HttpNames } from './types'

export const getDefaultResponse = (name: HttpNames): object => {
  const statusCode = HttpStatuses[name]
  const message = HttpMessages[name]

  return {
    statusCode,
    message
  }
}
