import { getDefaultResponse, HttpNames } from '../../src/http'

describe('getDefaultResponse', () => {
  console.log(HttpNames)
  const data = [
    {
      name: HttpNames.success,
      output: {
        statusCode: 200,
        message: 'Success'
      }
    },
    {
      name: HttpNames.created,
      output: {
        statusCode: 201,
        message: 'Record Created'
      }
    },
    {
      name: HttpNames.accepted,
      output: {
        statusCode: 202,
        message: 'Request Accepted'
      }
    },
    {
      name: HttpNames.badRequest,
      output: {
        statusCode: 400,
        message: 'Something went wrong'
      }
    },
    {
      name: HttpNames.unauthorized,
      output: {
        statusCode: 401,
        message: 'Unauthorized'
      }
    },
    {
      name: HttpNames.invalidSession,
      output: {
        statusCode: 401,
        message: 'Invalid Session'
      }
    },
    {
      name: HttpNames.forbidden,
      output: {
        statusCode: 403,
        message: 'Forbidden'
      }
    },
    {
      name: HttpNames.notFound,
      output: {
        statusCode: 404,
        message: 'Not Found'
      }
    },
    {
      name: HttpNames.userNotFound,
      output: {
        statusCode: 404,
        message: 'User not found'
      }
    },
    {
      name: HttpNames.integrationError,
      output: {
        statusCode: 406,
        message: 'An integration error occurred'
      }
    },
    {
      name: HttpNames.teaPot,
      output: {
        statusCode: 418,
        message: 'Can\'t get it done'
      }
    },
    {
      name: HttpNames.unprocessableEntity,
      output: {
        statusCode: 422,
        message: 'Validation error'
      }
    },
    {
      name: HttpNames.internalError,
      output: {
        statusCode: 500,
        message: 'I messed up (not your fault)'
      }
    }
  ]

  test.each(data)('Should return a default response object, accordantly with the name passed', (param) => {
    expect(getDefaultResponse(param.name)).toStrictEqual(param.output)
  })
})
