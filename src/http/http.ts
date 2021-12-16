import { HttpMessages, HttpStatuses } from './enums'

export const getDefaultResponse = (name: string): object => {
  const defaultResponse: object = {
    statusCode: HttpStatuses[name] ?? HttpStatuses.teaPot,
    message: HttpMessages[name] ?? HttpMessages.teaPot
  }

  return defaultResponse
}
