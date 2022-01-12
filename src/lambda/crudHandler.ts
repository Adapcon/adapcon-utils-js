import { lambdaGetParameters } from './lambdaGetParameters'
import { APIGatewayEvent } from 'aws-lambda'
import { error } from '../error'
import { getDefaultResponse, HttpNames } from '../http'

export const lambdaCrudHandler = (event: APIGatewayEvent): object => {
  return switchMethod(event)
}

const switchMethod = (event: APIGatewayEvent): object => {
  const { httpMethod } = event

  switch (httpMethod) {
    case 'GET':
      return getEvent(event)

    case 'POST':
      return postEvent(event)

    case 'PUT':
      return putEvent(event)

    case 'DELETE':
      return deleteEvent(event)

    default: {
      const notImplemented = getDefaultResponse('notImplemented' as HttpNames)
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw error(notImplemented.statusCode, notImplemented.message)
    }
  }
}

const getEvent = (event: APIGatewayEvent): object => {
  const parameters = lambdaGetParameters(event,
    {
      sort: 'headers',
      limit: 'headers',
      page: 'headers',
      columns: 'headers',
      filters: 'headers',
      'only-constructor': 'headers',
      'only-count': 'headers'
    }
  )
  return {
    httpMethod: 'GET',
    ...event.pathParameters,
    ...parameters
  }
}

const postEvent = (event: APIGatewayEvent): object => {
  const parameters = lambdaGetParameters(event,
    {
      body: 'body'
    })
  return {
    httpMethod: 'POST',
    ...event.pathParameters,
    ...parameters
  }
}

const putEvent = (event: APIGatewayEvent): object => {
  const parameters = lambdaGetParameters(event,
    {
      body: 'body'
    })
  return {
    httpMethod: 'PUT',
    ...event.pathParameters,
    ...parameters
  }
}

const deleteEvent = (event: APIGatewayEvent): object => {
  const parameters = lambdaGetParameters(event,
    {
      body: 'body'
    })
  return {
    httpMethod: 'DELETE',
    ...event.pathParameters,
    ...parameters
  }
}
