import { getDefaultResponse, HttpNames } from '../../src/http'

describe('getDefaultResponse', () => {
  const data = [
    {
      name: 'success' as HttpNames,
      output: {
        statusCode: 200,
        message: 'Success'
      }
    },
    {
      name: 'created' as HttpNames,
      output: {
        statusCode: 201,
        message: 'Record Created'
      }
    },
    {
      name: 'accepted' as HttpNames,
      output: {
        statusCode: 202,
        message: 'Request Accepted'
      }
    },
    {
      name: 'badRequest' as HttpNames,
      output: {
        statusCode: 400,
        message: 'Something went wrong'
      }
    },
    {
      name: 'unauthorized' as HttpNames,
      output: {
        statusCode: 401,
        message: 'Unauthorized'
      }
    },
    {
      name: 'invalidSession' as HttpNames,
      output: {
        statusCode: 401,
        message: 'Invalid Session'
      }
    },
    {
      name: 'forbidden' as HttpNames,
      output: {
        statusCode: 403,
        message: 'Forbidden'
      }
    },
    {
      name: 'notFound' as HttpNames,
      output: {
        statusCode: 404,
        message: 'Not Found'
      }
    },
    {
      name: 'userNotFound' as HttpNames,
      output: {
        statusCode: 404,
        message: 'User not found'
      }
    },
    {
      name: 'integrationError' as HttpNames,
      output: {
        statusCode: 406,
        message: 'An integration error occurred'
      }
    },
    {
      name: 'teaPot' as HttpNames,
      output: {
        statusCode: 418,
        message: 'Can\'t get it done'
      }
    },
    {
      name: 'unprocessableEntity' as HttpNames,
      output: {
        statusCode: 422,
        message: 'Validation error'
      }
    },
    {
      name: 'internalError' as HttpNames,
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
