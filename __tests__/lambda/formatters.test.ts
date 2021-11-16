import { formattedResponse, lambdaResp, lambdaRespError } from '../../src/lambda'

describe('invoke', () => {
  it('Should returns response formatted with status code 401', () => {
    expect(formattedResponse({
      StatusCode: 200,
      Payload: '{"statusCode":401,"body":"{\\"error\\":\\"Invalid Session\\"}"}'
    })).toEqual({ body: { error: 'Invalid Session' }, status: 401 })
  })

  it('Should returns response formatted with status code 200', () => {
    expect(formattedResponse({
      StatusCode: 200,
      Payload: '{"body":"{\\"error\\":\\"Invalid Session\\"}"}'
    })).toEqual({ body: { error: 'Invalid Session' }, status: 200 })
  })

  it('Should returns response formatted without status code and message', () => {
    expect(formattedResponse({
      Payload: '{"error":"Invalid Session"}'
    })).toEqual({ body: {}, status: undefined })
  })

  it('Should returns response formatted without status code', () => {
    expect(formattedResponse({
      Payload: '{"body":"{\\"error\\":\\"Invalid Session\\"}"}'
    })).toEqual({ body: { error: 'Invalid Session' }, status: undefined })
  })

  it('Should returns response formatted without a payload', () => {
    expect(formattedResponse({ StatusCode: 200 })).toEqual({ body: {}, status: 200 })
  })

  it('Should returns lambda response formatted with a body string', () => {
    expect(lambdaResp(201, 'Created')).toEqual({ body: 'Created', statusCode: 201 })
  })

  it('Should returns lambda response formatted with a body object', () => {
    expect(lambdaResp(201, { user: 'Created' })).toEqual({ body: '{\"user\":\"Created\"}', statusCode: 201 })
  })

  it('Should returns lambda response error formatted with status and message', () => {
    expect(lambdaRespError({ status: 404, message: 'User Not Found' })).toEqual({ statusCode: 404, body: '{\"error\":\"User Not Found\"}' })
  })

  it('Should returns lambda response error formatted with status code and error', () => {
    expect(lambdaRespError({ statusCode: 404, error: { user: 'Not Found' } })).toEqual({ statusCode: 404, body: '{\"error\":{\"user\":\"Not Found\"}}' })
  })

  it('Should returns lambda response error formatted without status', () => {
    expect(lambdaRespError({ message: 'Invalid field' })).toEqual({ statusCode: 500, body: '{\"error\":\"Invalid field\"}' })
  })

  it('Should returns lambda response error formatted without message', () => {
    expect(lambdaRespError({ statusCode: 500 })).toEqual({ statusCode: 500, body: '' })
  })

  it('Should returns lambda response error formatted without status and message', () => {
    expect(lambdaRespError({})).toEqual({ statusCode: 500, body: '' })
  })
})
