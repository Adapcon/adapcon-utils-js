import { lambdaResponseCorsHeaders } from '../../../src/lambda/lambdaResponseCors'

import { APIGatewayProxyEvent } from 'aws-lambda'

// Mocking
import MockEvent from './mock.json'

describe('Verifica o cabeçalho CORS da resposta da Lambda', () => {
  it('Verifica o cabeçalho CORS e retorna o headers', () => {
    const responseCors = lambdaResponseCorsHeaders({
      event: MockEvent.event as APIGatewayProxyEvent,
      allowedMethods: ['GET', 'POST'],
      urlsAllowed: 'https://*.example.com,https://*.another-example.com,https://third-example.com,https://*.homologacao.online',
    })

    expect(responseCors).toEqual({
      'Access-Control-Allow-Origin': 'https://admin.homologacao.online',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '0',
    })
  })

  it('Verifica o cabeçalho CORS e retorna o headers com origin vazio', () => {
    const responseCors = lambdaResponseCorsHeaders({
      event: MockEvent.event as APIGatewayProxyEvent,
      allowedMethods: ['GET', 'POST'],
      urlsAllowed: 'https://*.example.com,https://*.another-example.com,https://third-example.com',
    })

    expect(responseCors).toEqual({
      'Access-Control-Allow-Origin': '',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '0',
    })
  })

  it('Verifica o cabeçalho CORS e retorna o headers com urlsAllowed como *', () => {
    const responseCors = lambdaResponseCorsHeaders({
      event: MockEvent.event as APIGatewayProxyEvent,
      allowedMethods: ['GET']
    })

    expect(responseCors).toEqual({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '0',
    })
  })

  it('Verifica o cabeçalho CORS e retorna erro se urlsAllowed for vazio', () => {
    expect(() => {
      lambdaResponseCorsHeaders({
        event: MockEvent.event as APIGatewayProxyEvent,
        allowedMethods: ['GET', 'POST'],
        urlsAllowed: '',
      })
    }).toThrow('No URLs allowed for CORS')
  })

  it('Verifica o cabeçalho CORS e retorna erro se event for undefined', () => {
    expect(() => {
      lambdaResponseCorsHeaders({
        event: undefined as unknown as APIGatewayProxyEvent,
        allowedMethods: ['GET', 'POST'],
        urlsAllowed: 'https://*.example.com,https://*.another-example.com',
      })
    }).toThrow('Event is required for CORS headers')
  })
})
