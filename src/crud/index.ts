import { lambdaGetParameters } from '../lambda/lambdaGetParameters'
import { Event } from '../lambda/interfaces'

export const lambdaCrudHandler = (event: Event): object => {
  return switchMethod(event)
}

const switchMethod = (event: Event): object => {
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

    default:
      throw new Error()
  }
}

const getEvent = (event: Event): object => {
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

const postEvent = (event: Event): object => {
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

const putEvent = (event: Event): object => {
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

const deleteEvent = (event: Event): object => {
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
