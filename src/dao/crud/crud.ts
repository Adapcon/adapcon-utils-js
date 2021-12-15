import { lambdaGetParameters } from './../../lambda/lambdaGetParameters';
import { Event } from '../../lambda/interfaces'

export const lambdaCrudHandler = (event: Event): object => {
    const { httpMethod } = event

    switch (httpMethod) {
        case 'GET':
            return getEvent(event);

        case 'POST':
            return postEvent(event);

        case 'PUT':
            return putEvent(event);

        case 'DELETE':
            return deleteEvent(event);

        default:
            throw new Error();
    }
}

const getEvent = (event: Event): object => {
    console.log('event', event)
    const parameters = lambdaGetParameters(event,
        {
            'sort': 'headers',
            'limit': 'headers',
            'page': 'headers',
            'columns': 'headers',
            'filters': 'headers',
            'only-constructor': 'headers',
            'only-count': 'headers'
        })
    return {
        httpMethod: 'GET',
        ...parameters
    }
}

const postEvent = (event: Event): object => {
    const headers = event.headers
    const newEntity = event.body
    return {
        httpMethod: 'POST',
        headers,
        newEntity
    }
}

const putEvent = (event: Event): object => {
    const headers = event.headers
    const updatedEntity = event.body
    return {
        httpMethod: 'PUT',
        headers,
        updatedEntity,
    }
}

const deleteEvent = (event: Event): object => {
    const headers = event.headers
    const keys = event.pathParameters
    return {
        httpMethod: 'DELETE',
        headers,
        keys
    }
}

const getConstructor = (headers): string => {
    const constructor = headers?.onlyConstructor
    return constructor
}

const getCount = (headers): string => {
    const count = headers?.onlyCount
    return count
}

const getPage = (headers): string => {
    const page = headers?.page
    return page
}

const getPathParameter = (pathParameters): string => {
    var register = ''
    for (var property in pathParameters) {
        if (pathParameters.hasOwnProperty(property)) {
            register = property
            return property;
        }
    }
    return register;
}
