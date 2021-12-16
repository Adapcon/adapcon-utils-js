import { HttpMessages, HttpStatuses, HttpNames } from './enums'

export const getDefaultResponse = (name: HttpNames): object => {
  const statusCode = HttpStatuses[name]
  const message = HttpMessages[name]

  return {
    statusCode,
    message
  }
}
