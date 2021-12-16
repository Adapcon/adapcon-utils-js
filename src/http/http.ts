import { HttpMessages, HttpStatuses, HttpNames } from './enums'

export const getDefaultResponse = (name: HttpNames): object => {
  const defaultResponse: object = {
    statusCode: HttpStatuses[name] ?? HttpStatuses.teaPot,
    message: HttpMessages[name] ?? HttpMessages.teaPot
  }

  return defaultResponse
}
