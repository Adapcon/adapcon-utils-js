import { getDefaultResponse } from '../../src/http'

describe('getDefaultResponse', () => {
  const data = [
    {
      name: 'success',
      output: {
        statusCode: 200,
        message: 'Success'
      }
    },
    {
      name: 'created',
      output: {
        statusCode: 201,
        message: 'Record Created'
      }
    },
    {
      name: 'accepted',
      output: {
        statusCode: 202,
        message: 'Request Accepted'
      }
    },
    {
      name: 'badRequest',
      output: {
        statusCode: 400,
        message: 'Something went wrong'
      }
    },
    {
      name: 'unauthorized',
      output: {
        statusCode: 401,
        message: 'Unauthorized'
      }
    },
    {
      name: 'invalidSession',
      output: {
        statusCode: 401,
        message: 'Invalid Session'
      }
    },
    {
      name: 'forbidden',
      output: {
        statusCode: 403,
        message: 'Forbidden'
      }
    },
    {
      name: 'notFound',
      output: {
        statusCode: 404,
        message: 'Not Found'
      }
    },
    {
      name: 'userNotFound',
      output: {
        statusCode: 404,
        message: 'User not found'
      }
    },
    {
      name: 'integrationError',
      output: {
        statusCode: 406,
        message: 'An integration error occurred'
      }
    },
    {
      name: 'teaPot',
      output: {
        statusCode: 418,
        message: 'Can\'t get it done'
      }
    },
    {
      name: 'unprocessableEntity',
      output: {
        statusCode: 422,
        message: 'Validation error'
      }
    },
    {
      name: 'internalError',
      output: {
        statusCode: 500,
        message: 'I messed up (not your fault)'
      }
    },
    {
      name: 'anotherInvalidMessage',
      output: {
        statusCode: 418,
        message: 'Can\'t get it done'
      }
    }
  ]

  test.each(data)('Should return a default response object, accordantly with the name passed', (param) => {
    expect(getDefaultResponse(param.name)).toStrictEqual(param.output)
  })
})
