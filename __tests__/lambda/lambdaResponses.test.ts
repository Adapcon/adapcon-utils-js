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
    },
    {
      input: {
        statusCode: 200,
        body: '',
        headers: { 'total-count': 42069 }
      },
      output: {
        statusCode: 200,
        body: '',
        headers: { 'total-count': 42069 }
      }
    }
  ]

  test.each(data)('Should return an response Object, with statusCode and body props', (param) => {
    expect(lambdaResp(param.input.statusCode, param.input.body, param.input.headers)).toStrictEqual(param.output)
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

it('Should returns lambda response formatted with a body string', () => {
  expect(lambdaResp(201, 'Created')).toEqual({ body: 'Created', statusCode: 201 })
})

it('Should returns lambda response formatted with a body object', () => {
  expect(lambdaResp(201, { user: 'Created' })).toEqual({ body: '{"user":"Created"}', statusCode: 201 })
})

it('Should returns lambda response error formatted with status and message', () => {
  expect(lambdaRespError({ status: 404, message: 'User Not Found' })).toEqual({ statusCode: 404, body: '{"error":"User Not Found"}' })
})

it('Should returns lambda response error formatted with status code and error', () => {
  expect(lambdaRespError({ statusCode: 404, error: { user: 'Not Found' } })).toEqual({ statusCode: 404, body: '{"error":{"user":"Not Found"}}' })
})

it('Should returns lambda response error formatted without status', () => {
  expect(lambdaRespError({ message: 'Invalid field' })).toEqual({ statusCode: 500, body: '{"error":"Invalid field"}' })
})

it('Should returns lambda response error formatted without message', () => {
  expect(lambdaRespError({ statusCode: 500 })).toEqual({ statusCode: 500, body: '' })
})

it('Should returns lambda response error formatted without status and message', () => {
  expect(lambdaRespError({})).toEqual({ statusCode: 500, body: '' })
})
