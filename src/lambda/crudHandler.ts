import { lambdaGetParameters } from './lambdaGetParameters'
import { APIGatewayEvent } from 'aws-lambda'
import { error } from '../error'
import { getDefaultResponse, HttpNames } from '../http'
import { CrudInputParams } from '../'

export const lambdaCrudHandler = (
  event: APIGatewayEvent,
  customParameters: {[key: string]: string} = {}
): CrudInputParams => {
  return switchMethod(event, customParameters)
}

const switchMethod = (event: APIGatewayEvent, customParameters): CrudInputParams => {
  const { httpMethod } = event

  switch (httpMethod) {
    case 'GET':
      return getEvent(event, customParameters)

    case 'POST':
      return postEvent(event, customParameters)

    case 'PUT':
      return putEvent(event, customParameters)

    case 'DELETE':
      return deleteEvent(event, customParameters)

    default: {
      const notImplemented = getDefaultResponse('notImplemented' as HttpNames)
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw error(notImplemented.statusCode, notImplemented.message)
    }
  }
}

const getEvent = (event: APIGatewayEvent, customParameters): CrudInputParams => {
  const parameters = lambdaGetParameters(event,
    {
      sort: 'headers',
      limit: 'headers',
      page: 'headers',
      columns: 'headers',
      filters: 'headers',
      'only-count': 'headers',
      search: 'headers'
    })
  return {
    httpMethod: 'GET',
    keys: { ...event.pathParameters },
    ...parameters,
    customParameters: {
      ...lambdaGetParameters(event, {
        ...customParameters
      })
    }
  }
}

const postEvent = (event: APIGatewayEvent, customParameters): CrudInputParams => {
  const parameters: {body?: string} = lambdaGetParameters(event, {
    body: 'body'

  })
  return {
    httpMethod: 'POST',
    keys: { ...event.pathParameters },
    entity: parameters.body ? JSON.parse(parameters.body) : {},
    customParameters: {
      ...lambdaGetParameters(event, {
        ...customParameters
      })
    }
  }
}

const putEvent = (event: APIGatewayEvent, customParameters): CrudInputParams => {
  const parameters: {body?: string} = lambdaGetParameters(event,
    {
      body: 'body'

    })
  return {
    httpMethod: 'PUT',
    keys: { ...event.pathParameters },
    entity: parameters.body ? JSON.parse(parameters.body) : {},
    customParameters: {
      ...lambdaGetParameters(event, {
        ...customParameters
      })
    }
  }
}

const deleteEvent = (event: APIGatewayEvent, customParameters): CrudInputParams => {
  const parameters = lambdaGetParameters(event,
    {

    })
  return {
    httpMethod: 'DELETE',
    keys: { ...event.pathParameters },
    ...parameters,
    customParameters: {
      ...lambdaGetParameters(event, {
        ...customParameters
      })
    }
  }
}
