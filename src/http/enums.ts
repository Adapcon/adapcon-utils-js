export enum HttpMessages {
  success = 'Success',
  created = 'Record Created',
  accepted = 'Request Accepted',
  badRequest = 'Something went wrong',
  unauthorized = 'Unauthorized',
  invalidSession = 'Invalid Session',
  forbidden = 'Forbidden',
  notFound = 'Not Found',
  userNotFound = 'User not found',
  integrationError = 'An integration error occurred',
  teaPot = 'Can\'t get it done',
  unprocessableEntity = 'Validation error',
  internalError = 'I messed up (not your fault)',
  notImplemented = 'The server does not support the functionality required to fulfill the request'
}

export enum HttpStatuses {
  success = 200,
  created = 201,
  accepted = 202,
  badRequest = 400,
  unauthorized = 401,
  invalidSession = 401,
  forbidden = 403,
  notFound = 404,
  userNotFound = 404,
  integrationError = 406,
  teaPot = 418,
  unprocessableEntity = 422,
  internalError = 500,
  notImplemented = 501
}
