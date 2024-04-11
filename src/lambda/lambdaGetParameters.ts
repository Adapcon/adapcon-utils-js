import { HttpStatuses } from '../http/enums'
import { kebabCaseToCamelCase } from './../string/formatters'
import { APIGatewayEvent } from 'aws-lambda'
import { error } from '../error/index'
import { Docfy, DocfySettings } from '.'

interface Params {
  [key: string]: string | number | boolean
}

interface Errs {

  [key: string]: string
}

export const lambdaGetParameters = (event: object, eventParams: object): { [key: string]: any } => {
  const fedParams = {}

  for (const element of Object.keys(eventParams)) {
    const path: string = eventParams[element]

    if (path in event) {
      const eventPathObject: object = event[path]
      if (!eventPathObject) continue
      const fedParam: any = path === 'body' ? eventPathObject : eventPathObject[element]
      let paramKey: string = element
      if (path === 'headers') {
        paramKey = kebabCaseToCamelCase(element)
      }
      fedParams[paramKey] = fedParam
    }
  }

  return fedParams
}

/**
 * Get a value from an object using a path
 */
const get = (obj, path) => path.split('.').reduce((acc, part) => acc?.[part], obj)

/**
 * Extract parameters from an API Gateway event
 */
const extractParams = (docfy: Docfy, parameter: string, evt: APIGatewayEvent) => {
  const params = {}
  const errs = {}

  for (const [keyBase, value] of Object.entries(docfy[parameter] ?? {}) as Array<[key: string, value: DocfySettings]>) {
    const key = parameter === 'headers' ? keyBase.toLowerCase() : keyBase

    const identity = value.translate ?? keyBase
    const param = get(evt, `${parameter}.${key}`) ?? value.default

    const hasParamValue = params[identity]
    const hasValue = param && param !== 'undefined'
    const isRequired = value.required ?? parameter === 'pathParameters'

    if (isRequired && (!hasValue || !hasParamValue)) {
      errs[keyBase] = `Missing(${parameter}) ${value.label}`
    } else {
      params[identity] = param
    }
  }
  return { params, errs }
}

/**
 * Format headers to lowercase
 */
const formatHeadersCase = (evt: APIGatewayEvent) => {
  const headers = {}
  for (const [key, value] of Object.entries(evt.headers)) {
    headers[key.toLowerCase()] = value
  }
  return { ...evt, headers }
}

/**
 * Get parameters from an API Gateway event
 */
export const lambdaSettingsGetParameters = <T>(docfy: Docfy, evt: APIGatewayEvent) => {
  const parameters = {}
  const errs: { [key: string]: string } = {}

  const newEvn = formatHeadersCase(evt)
  const headers = extractParams(docfy, 'headers', newEvn)
  Object.assign(parameters, headers.params)
  Object.assign(errs, headers.errs)

  const queryStringParameters = extractParams(docfy, 'queryStringParameters', evt)
  Object.assign(parameters, queryStringParameters.params)
  Object.assign(errs, queryStringParameters.errs)

  const pathParameters = extractParams(docfy, 'pathParameters', evt)
  Object.assign(parameters, pathParameters.params)
  Object.assign(errs, pathParameters.errs)

  const requestContext = extractParams(docfy, 'requestContext', evt)
  Object.assign(parameters, requestContext.params)
  Object.assign(errs, requestContext.errs)

  const fromEvent = extractParams(docfy, 'fromEvent', { ...evt })
  Object.assign(parameters, fromEvent.params)
  Object.assign(errs, fromEvent.errs)

  if (docfy.body) {
    try {
      const evtObj = {
        body: JSON.parse(get(evt, 'body'))
      }
      const requestBody: { params: Params, errs: Errs } = extractParams(docfy, 'body', evtObj as APIGatewayEvent)
      Object.assign(parameters, requestBody.params)
      Object.assign(errs, requestBody.errs)
    } catch (err) {
      errs.body = 'Invalid JSON'
    }
  }

  if (Object.keys(errs).length > 0) throw error(HttpStatuses.badRequest, errs)
  return parameters as T
}
