export const lambdaRequestEventExample = {
  resource: '/store/cart/v1/app/{app}/getAllCarts',
  path: '/store/cart/v1/app/amc/getAllCarts',
  httpMethod: 'GET',
  headers: {
    'Accept-Encoding': 'gzip',
    'Cache-Control': 'no-cache',
    'CloudFront-Forwarded-Proto': 'https',
    'CloudFront-Is-Desktop-Viewer': 'true',
    'CloudFront-Is-Mobile-Viewer': 'false',
    'CloudFront-Is-SmartTV-Viewer': 'false',
    'CloudFront-Is-Tablet-Viewer': 'false',
    'CloudFront-Viewer-ASN': '16509',
    'CloudFront-Viewer-Country': 'US',
    'Content-Type': 'application/json',
    Host: 'nmmig9qv41.execute-api.sa-east-1.amazonaws.com',
    'Postman-Token': 'f563fcb6-fe23-4140-b331-f637f674a17e',
    'User-Agent': 'Amazon CloudFront',
    Via: '1.1 95e43744e352ed38ebd2ad61ada98fec.cloudfront.net (CloudFront), 1.1 4d62f3e4306e9233a7b51d4552716582.cloudfront.net (CloudFront)',
    'X-Amz-Cf-Id': 'Oo8ks9mQE3SAOQzBqC2wQzgr7sawqccyu0ArR-Q0NxrI-0UY5YQamQ==',
    'X-Amzn-Trace-Id': 'Root=1-639741e2-4b6acf992c0e70a743ec89fe',
    'X-Forwarded-For': '45.163.73.34, 130.176.35.86, 130.176.164.73',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https'
  },
  multiValueHeaders: {
    'Accept-Encoding': ['gzip'],
    'Cache-Control': ['no-cache'],
    'CloudFront-Forwarded-Proto': ['https'],
    'CloudFront-Is-Desktop-Viewer': ['true'],
    'CloudFront-Is-Mobile-Viewer': ['false'],
    'CloudFront-Is-SmartTV-Viewer': ['false'],
    'CloudFront-Is-Tablet-Viewer': ['false'],
    'CloudFront-Viewer-ASN': ['16509'],
    'CloudFront-Viewer-Country': ['US'],
    'Content-Type': ['application/json'],
    Host: ['nmmig9qv41.execute-api.sa-east-1.amazonaws.com'],
    'Postman-Token': ['f563fcb6-fe23-4140-b331-f637f674a17e'],
    'User-Agent': ['Amazon CloudFront'],
    Via: [
      '1.1 95e43744e352ed38ebd2ad61ada98fec.cloudfront.net (CloudFront), 1.1 4d62f3e4306e9233a7b51d4552716582.cloudfront.net (CloudFront)'
    ],
    'X-Amz-Cf-Id': ['Oo8ks9mQE3SAOQzBqC2wQzgr7sawqccyu0ArR-Q0NxrI-0UY5YQamQ=='],
    'X-Amzn-Trace-Id': ['Root=1-639741e2-4b6acf992c0e70a743ec89fe'],
    'X-Forwarded-For': ['45.163.73.34, 130.176.35.86, 130.176.164.73'],
    'X-Forwarded-Port': ['443'],
    'X-Forwarded-Proto': ['https']
  },
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: { app: 'amc' },
  stageVariables: null,
  requestContext: {
    resourceId: 're1q73',
    resourcePath: '/store/cart/v1/app/{app}/getAllCarts',
    httpMethod: 'GET',
    extendedRequestId: 'dCc7eH7smjQFV-w=',
    requestTime: '12/Dec/2022:14:59:46 +0000',
    path: '/api/store/cart/v1/app/amc/getAllCarts',
    accountId: '110396450935',
    protocol: 'HTTP/1.1',
    stage: 'api',
    domainPrefix: 'nmmig9qv41',
    requestTimeEpoch: 1670857186885,
    requestId: 'e91b8321-1679-4dc8-835c-b7bbb361837c',
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: '130.176.35.86',
      principalOrgId: null,
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent: 'Amazon CloudFront',
      user: null
    },
    domainName: 'nmmig9qv41.execute-api.sa-east-1.amazonaws.com',
    apiId: 'nmmig9qv41'
  },
  body: null,
  isBase64Encoded: false
}

export const lambdaInvokeEventExample = {
  headers: {
    lastCartId: '00079f25882993964c0860b71c906eb8',
    limitItems: '2',
    code: '#1nt3gr4t10n'
  },
  body: {},
  pathParameters: { app: 'amc' },
  queryStringParameters: {}
}
