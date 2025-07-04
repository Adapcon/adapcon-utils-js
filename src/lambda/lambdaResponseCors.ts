import { APIGatewayProxyEvent } from 'aws-lambda'
import { URL } from 'url'

type EnumAllowedMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'

const URL_ALLOWED_ORIGIN = 'https://*.simplificamais.com.br,https://*.portaldocliente.online,https://*.homologacao.online'

/**
 * Return the origin from the event headers.
 */
function getOriginAndDomainFromEvent (event: APIGatewayProxyEvent): URL {
  const originHeader = event.headers?.origin ?? event.headers?.Origin

  if (!originHeader) throw new Error('Origin header is missing in the event')

  try {
    return new URL(originHeader)
  } catch (error) {
    throw new Error(`Invalid origin header CORS: ${originHeader}`)
  }
}

/**
 * @param event - The API Gateway event
 * @param AllowedMethods - Array of allowed HTTP methods for CORS
 * @param urlsAllowed - Comma-separated list of allowed URLs for CORS
 * @returns An object containing CORS headers
 * @example
 * const corsHeaders = lambdaResponseCorsHeaders({
 *   event,
 *   AllowedMethods: ['GET', 'POST'],
 *   urlsAllowed: 'https://example.com,https://another-example.com'
 * })
 */
export function lambdaResponseCorsHeaders ({
  event,
  allowedMethods = ['GET'],
  urlsAllowed = null,
  accessControlAllowHeaders = '*',
  accessControlMaxAge = '0'
}: {
  event: APIGatewayProxyEvent
  allowedMethods?: EnumAllowedMethods[]
  urlsAllowed?: string | null
  accessControlAllowHeaders?: string
  accessControlMaxAge?: string
}) {
  if (!event) throw new Error('Event is required for CORS headers')
  if (urlsAllowed === '*') throw new Error('URLs allowed cannot be * for CORS')

  const url: URL = getOriginAndDomainFromEvent(event)
  let corsOrigin = ''

  if (!allowedMethods.includes('OPTIONS')) allowedMethods.push('OPTIONS')

  const domain = url.hostname.split('.')[0] ?? ''

  const urlsAllowedOrigin = urlsAllowed ? `${URL_ALLOWED_ORIGIN},${urlsAllowed}` : URL_ALLOWED_ORIGIN

  const urlsAllowedWithDomain = urlsAllowedOrigin.replace(/\*/g, domain)

  const allowedOrigins = urlsAllowedWithDomain.split(',').map(url => url.trim())

  if (url.origin && allowedOrigins.includes(url.origin)) {
    corsOrigin = url.origin
  } else {
    corsOrigin = ''
  }

  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': allowedMethods.join(','),
    'Access-Control-Allow-Headers': accessControlAllowHeaders,
    'Access-Control-Max-Age': accessControlMaxAge
  }
}
