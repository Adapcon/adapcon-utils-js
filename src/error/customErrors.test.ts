import { HttpStatuses } from '..'
import { InternalError, BadRequestError, NotFoundError, IntegrationError, UnauthorizedError, PreconditionFailedError, ConflictError } from './customErrors'

describe('CustomError', () => {
  describe('InternalError', () => {
    it('should return a ConnectionError with correct message and statusCode', () => {
      const error = new InternalError(new Error('throwing error'))

      expect(error).toMatchObject({
        message: 'throwing error',
        statusCode: HttpStatuses.internalError
      })
    })

    it('should return string containing correct items on toString() call', () => {
      const error = new InternalError(new Error('throwing error'))

      expect(error.toString()).toContain('Internal Error: throwing error')
    })

    it('should return correct lambdaResponse on toLambdaResponse() call', () => {
      const error = new InternalError(new Error('throwing error'))

      expect(error.toLambdaResponse()).toMatchObject({
        statusCode: HttpStatuses.internalError,
        body: JSON.stringify({ message: 'throwing error' })
      })
    })
  })

  describe('IntegrationError', () => {
    it('should return a IntegrationError with correct message and statusCode', () => {
      const integrationName = 'microservice1'
      const error = new IntegrationError(integrationName)

      expect(error).toMatchObject({
        message: `Could not integration with ${integrationName}`,
        statusCode: HttpStatuses.integrationError
      })
    })

    it('IntegrationError toString()', () => {
      const integrationName = 'microservice1'
      const error = new IntegrationError(integrationName)

      expect(error.toString()).toContain(`Integration Error: Could not integration with ${integrationName}`)
    })

    it('should return correct lambdaResponse on toLambdaResponse() call', () => {
      const integrationName = 'microservice1'
      const error = new IntegrationError(integrationName)

      expect(error.toLambdaResponse()).toMatchObject({
        statusCode: HttpStatuses.integrationError,
        body: JSON.stringify({ message: `Could not integration with ${integrationName}` })
      })
    })

    it('should return a IntegrationError with correct message, statusCode, and customError message', () => {
      const integrationName = 'microservice1'
      const customMessage = 'microservice1 is offline'
      const error = new IntegrationError(integrationName, customMessage)

      expect(error).toMatchObject({
        message: customMessage,
        statusCode: HttpStatuses.integrationError,
        customMessage
      })
    })

    it('IntegrationError toString() with customError message', () => {
      const integrationName = 'microservice1'
      const error = new IntegrationError(integrationName, 'microservice1 is offline')

      expect(error.toString()).toContain('Integration Error: microservice1 is offline')
    })

    it('should return correct lambdaResponse on toLambdaResponse() call with customError message', () => {
      const integrationName = 'microservice1'
      const customMessage = 'microservice1 is offline'
      const error = new IntegrationError(integrationName, customMessage)

      expect(error.toLambdaResponse()).toMatchObject({
        statusCode: HttpStatuses.integrationError,
        body: JSON.stringify({ message: customMessage })
      })
    })
  })

  describe('BadRequestError', () => {
    it('should return a BadRequestError with correct message and statusCode', () => {
      const errorMessage = 'invalid appId'
      const error = new BadRequestError(errorMessage)

      expect(error).toMatchObject({
        message: errorMessage,
        statusCode: HttpStatuses.badRequest
      })
    })

    it('should return string containing correct items on toString() call', () => {
      const errorMessage = 'invalid appId'
      const error = new BadRequestError(errorMessage)

      expect(error.toString()).toContain(`Bad Request Error: ${errorMessage}`)
    })

    it('should return correct lambdaResponse on toLambdaResponse() call', () => {
      const errorMessage = 'invalid appId'
      const error = new BadRequestError(errorMessage)

      expect(error.toLambdaResponse()).toMatchObject({
        statusCode: HttpStatuses.badRequest,
        body: JSON.stringify({ message: errorMessage })
      })
    })
  })

  describe('NotFoundError', () => {
    it('should return a NotFoundError with correct message and statusCode', () => {
      const errorMessage = 'thing not found'
      const error = new NotFoundError(errorMessage)

      expect(error).toMatchObject({
        message: errorMessage,
        statusCode: HttpStatuses.notFound
      })
    })

    it('should return string containing correct items on toString() call', () => {
      const errorMessage = 'thing not found'
      const error = new NotFoundError(errorMessage)

      expect(error.toString()).toContain(`Not Found Error: ${errorMessage}`)
    })

    it('should return correct lambdaResponse on toLambdaResponse() call', () => {
      const errorMessage = 'thing not found'
      const error = new NotFoundError(errorMessage)

      expect(error.toLambdaResponse()).toMatchObject({
        statusCode: HttpStatuses.notFound,
        body: JSON.stringify({ message: errorMessage })
      })
    })
  })
  describe('UnauthorizedError', () => {
    it('should return a UnauthorizedError with correct message and statusCode', () => {
      const errorMessage = 'not enough permissions'
      const error = new UnauthorizedError(errorMessage)

      expect(error).toMatchObject({
        message: errorMessage,
        statusCode: HttpStatuses.unauthorized
      })
    })

    it('should return string containing correct items on toString() call', () => {
      const errorMessage = 'not enough permissions'
      const error = new UnauthorizedError(errorMessage)

      expect(error.toString()).toContain(`Unauthorized Error: ${errorMessage}`)
    })

    it('should return correct lambdaResponse on toLambdaResponse() call', () => {
      const errorMessage = 'not enough permissions'
      const error = new UnauthorizedError(errorMessage)

      expect(error.toLambdaResponse()).toMatchObject({
        statusCode: HttpStatuses.unauthorized,
        body: JSON.stringify({ message: errorMessage })
      })
    })
  })

  describe('PreconditionFailedError', () => {
    it('should return a PreconditionFailedError with correct message and statusCode', () => {
      const errorMessage = 'precondition failed'
      const error = new PreconditionFailedError(errorMessage)

      expect(error).toMatchObject({
        message: errorMessage,
        statusCode: HttpStatuses.preconditionFailed
      })
    })

    it('should return string containing correct items on toString() call', () => {
      const errorMessage = 'precondition failed'
      const error = new PreconditionFailedError(errorMessage)

      expect(error.toString()).toContain(`Precondition Failed Error: ${errorMessage}`)
    })

    it('should return correct lambdaResponse on toLambdaResponse() call', () => {
      const errorMessage = 'precondition failed'
      const error = new PreconditionFailedError(errorMessage)

      expect(error.toLambdaResponse()).toMatchObject({
        statusCode: HttpStatuses.preconditionFailed,
        body: JSON.stringify({ message: errorMessage })
      })
    })
  })

  describe('ConflictError', () => {
    it('should return a ConflictError with correct message and statusCode', () => {
      const errorMessage = 'conflict'
      const error = new ConflictError(errorMessage)

      expect(error).toMatchObject({
        message: errorMessage,
        statusCode: HttpStatuses.conflict
      })
    })

    it('should return string containing correct items on toString() call', () => {
      const errorMessage = 'conflict'
      const error = new ConflictError(errorMessage)

      expect(error.toString()).toContain(`Conflict Error: ${errorMessage}`)
    })

    it('should return correct lambdaResponse on toLambdaResponse() call', () => {
      const errorMessage = 'conflict'
      const error = new ConflictError(errorMessage)

      expect(error.toLambdaResponse()).toMatchObject({
        statusCode: HttpStatuses.conflict,
        body: JSON.stringify({ message: errorMessage })
      })
    })
  })
})
