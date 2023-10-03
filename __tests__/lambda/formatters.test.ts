import { formattedResponse, getBody } from '../../src/lambda'

describe('invoke', () => {
  it('Should returns response formatted with status code 401', () => {
    expect(formattedResponse({
      StatusCode: 200,
      Payload: '{"statusCode":401,"body":"{\\"error\\":\\"Invalid Session\\"}"}'
    })).toEqual({ body: { error: 'Invalid Session' }, status: 401 })
  })

  it('Should returns response formatted with headers', () => {
    expect(formattedResponse({
      StatusCode: 200,
      Payload: '{"headers":"{\\"total-count\\":\\"20\\"}"}'
    })).toEqual({ headers: { 'total-count': '20' }, status: 200, body: {} })
  })

  it('Should returns response formatted with headers and body', () => {
    expect(formattedResponse({
      StatusCode: 200,
      Payload: '{"headers": "{\\"total-count\\":\\"20\\"}","body": "{\\"name\\":\\"John Doe\\"}"}'
    })).toEqual({ headers: { 'total-count': '20' }, status: 200, body: { name: 'John Doe' } })
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
})

describe('getBody', () => {
  it('Should returns body formatted', () => {
    const event = {
      body: '{\r\n "dueDate": "12/10/2020",\r\n    "value": 123.00,\r\n     "link": "https://google.com"\r\n}'
    }

    const expectedReturn = {
      dueDate: '12/10/2020',
      value: 123,
      link: 'https://google.com'
    }

    expect(getBody(event)).toEqual(expectedReturn)
  })
  it('Should returns null', () => {
    const event = {
      body: 10
    }

    expect(getBody(event)).toEqual(null)
  })
  it('Should returns the default value', () => {
    const event = {
      body: 10
    }

    expect(getBody(event, { test: true })).toEqual({ test: true })
  })
  it('Should returns null', () => {
    const event = undefined

    expect(getBody(event)).toEqual(null)
  })
  it('Should returns null', () => {
    const event = {
      body: 'test'
    }

    expect(getBody(event)).toEqual(null)
  })
  it('Should returns the original body', () => {
    const event = {
      body: {
        deu: 'boa'
      }
    }

    expect(getBody(event)).toEqual(event.body)
  })
})
