import { lambdaResponseCorsHeaders } from '../../../src/lambda/lambdaResponseCors'
import { APIGatewayProxyEvent } from 'aws-lambda'
import MockEvent from './mock.json'

describe('lambdaResponseCorsHeaders', () => {
  it('returns CORS headers when origin matches an allowed URL with domain placeholder replacement', () => {
    const response = lambdaResponseCorsHeaders({
      event: MockEvent.event as APIGatewayProxyEvent,
      allowedMethods: ['GET', 'POST'],
      urlsAllowed: 'https://*.example.com,https://*.another-example.com,https://third-example.com',
    })

    expect(response).toEqual({
      'Access-Control-Allow-Origin': 'https://admin.homologacao.online',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '0',
    })
  })

  it('returns CORS headers using default allowed URLs when no additional ones are provided', () => {
    const response = lambdaResponseCorsHeaders({
      event: MockEvent.event as APIGatewayProxyEvent,
    })

    expect(response).toEqual({
      'Access-Control-Allow-Origin': 'https://admin.homologacao.online',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '0',
    })
  })

  it('returns CORS headers when the origin exactly matches a custom allowed URL', () => {
    const response = lambdaResponseCorsHeaders({
      event: MockEvent.event as APIGatewayProxyEvent,
      allowedMethods: ['GET', 'POST'],
      urlsAllowed: 'https://admin.homologacao.online',
    })

    expect(response).toEqual({
      'Access-Control-Allow-Origin': 'https://admin.homologacao.online',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '0',
    })
  })

  it('throws an error when urlsAllowed is set to "*" which is not allowed', () => {
    expect(() => {
      lambdaResponseCorsHeaders({
        event: MockEvent.event as APIGatewayProxyEvent,
        allowedMethods: ['GET', 'POST'],
        urlsAllowed: '*',
      })
    }).toThrow('URLs allowed cannot be * for CORS')
  })

  it('throws an error when the event is not provided', () => {
    expect(() => {
      lambdaResponseCorsHeaders({
        event: undefined as unknown as APIGatewayProxyEvent,
        allowedMethods: ['GET', 'POST'],
        urlsAllowed: 'https://*.example.com,https://*.another-example.com',
      })
    }).toThrow('Event is required for CORS headers')
  })

  it('returns empty origin when the origin is not included in the allowed list', () => {
    const modifiedEvent = {
      ...MockEvent.event,
      headers: {
        ...MockEvent.event.headers,
        origin: 'https://teste.com',
      },
    } as APIGatewayProxyEvent

    const response = lambdaResponseCorsHeaders({
      event: modifiedEvent,
      allowedMethods: ['GET'],
    })

    expect(response).toEqual({
      'Access-Control-Allow-Origin': '',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '0',
    })
  })

  it('throws an error when the origin header is missing from the request', () => {
    const modifiedEvent = {
      ...MockEvent.event,
      headers: {},
    } as APIGatewayProxyEvent

    expect(() => {
      lambdaResponseCorsHeaders({
        event: modifiedEvent,
        allowedMethods: ['GET'],
      })
    }).toThrow('Origin header is missing in the event')
  })

  it('throws an error when the origin header is invalid', () => {
    const modifiedEvent = {
      ...MockEvent.event,
      headers: {
        ...MockEvent.event.headers,
        origin: 'teste.com.br',
      },
    } as APIGatewayProxyEvent

    expect(() => {
      lambdaResponseCorsHeaders({
        event: modifiedEvent,
        allowedMethods: ['GET'],
      })
    }).toThrow('Invalid origin header CORS: teste.com.br')
  })
})
