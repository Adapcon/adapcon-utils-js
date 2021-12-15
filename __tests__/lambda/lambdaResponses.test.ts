import { lambdaResp, lambdaRespError } from '../../src/lambda'
// import type { Error } from '../../src/lambda'

describe('lambdaResp', () => {
  const data = [
    {
      input: {
        statusCode: 200,
        body: ''
      },
      output: {
        statusCode: 200,
        body: ''
      }
    },
    {
      input: {
        statusCode: 201,
        body: {
          message: 'Created!',
          internalCode: '1032'
        }
      },
      output: {
        statusCode: 201,
        body: '{"message":"Created!","internalCode":"1032"}'
      }
    },
    {
      input: {
        statusCode: 404,
        body: 'not found!'
      },
      output: {
        statusCode: 404,
        body: 'not found!'
      }
    }
  ]

  test.each(data)('Should return an response Object, with statusCode and body props', (param) => {
    expect(lambdaResp(param.input.statusCode, param.input.body)).toStrictEqual(param.output)
  })
})

describe('lambdaRespError', () => {
  const data = [
    {
      error: {
        status: 500,
        error: 'all wrong! Do it right'
      },
      response: {
        statusCode: 500,
        body: '{"error":"all wrong! Do it right"}'
      }
    },
    {
      error: {
        oneRandomProp: 404,
        anotherRandomProp: 'all wrong! Do it right'
      },
      response: {
        statusCode: 500,
        body: ''
      }
    },
    {
      error: {
        statusCode: 404,
        message: 'these are not the droids you\'re looking for. move along'
      },
      response: {
        statusCode: 404,
        body: '{"error":"these are not the droids you\'re looking for. move along"}'
      }
    },
    {
      error: {
        statusCode: NaN,
        message: 'these are not the droids you\'re looking for. move along'
      },
      response: {
        statusCode: 500,
        body: '{"error":"these are not the droids you\'re looking for. move along"}'
      }
    },
    {
      error: {
        status: NaN,
        message: 'these are not the droids you\'re looking for. move along'
      },
      response: {
        statusCode: 500,
        body: '{"error":"these are not the droids you\'re looking for. move along"}'
      }
    }
  ]

  test.each(data)('Should return an error response Object, with statusCode and body props', (param) => {
    expect(lambdaRespError(param.error)).toStrictEqual(param.response)
  })
})
