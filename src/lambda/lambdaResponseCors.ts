import { APIGatewayProxyEvent } from 'aws-lambda'
import { URL } from 'url'

type EnumAllowedMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'

function getDomain (event: APIGatewayProxyEvent): { domain: string, origin: string } {
  const headers = event.headers || {}
  const origin = headers.origin

  if (!origin) {
    return { domain: '', origin: '' }
  }

  const { hostname } = new URL(origin)

  const domain = hostname.split('.')[0]

  return { domain, origin }
}

/**
 *
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
  urlsAllowed = '*',
  accessControlAllowHeaders = '*',
  accessControlMaxAge = '0'
}: {
  event: APIGatewayProxyEvent
  allowedMethods?: EnumAllowedMethods[]
  urlsAllowed?: string
  accessControlAllowHeaders?: string
  accessControlMaxAge?: string
}) {
  if (!event) throw new Error('Event is required for CORS headers')
  if (!urlsAllowed) throw new Error('No URLs allowed for CORS')

  allowedMethods.push('OPTIONS')

  let corsOrigin = ''

  if (urlsAllowed === '*') {
    corsOrigin = '*'
  } else {
    const { domain, origin } = getDomain(event)
    const urlsAllowedFormatted = urlsAllowed.replace(/\*/g, domain).split(',')
    corsOrigin = urlsAllowedFormatted.find(url => url.includes(origin)) ?? ''
  }

  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': allowedMethods.join(','),
    'Access-Control-Allow-Headers': accessControlAllowHeaders,
    'Access-Control-Max-Age': accessControlMaxAge
  }
}
