import { invokeEventCheck } from '../../src/lambda'

describe('invokeEventCheck', () => {
  const data = [
    {
      event: {
        pathParameters: {
          auth: 'xyz',
          app: 'theAppId'
        },
        queryParameters: {
          date: 1639423222426
        },
        httpMethod: '',
        functionName: 'meleca'
      },
      output: {
        invoke: true
      }
    },
    {
      event: {
        pathParameters: {
          auth: 'xyz',
          app: 'theAppId'
        },
        queryParameters: {
          date: 1639423222426
        },
        httpMethod: 'GET',
        functionName: 'meleca'
      },
      output: {
        invoke: false
      }
    },
    {
      event: {
        pathParameters: {
          auth: 'xyz',
          app: 'theAppId'
        },
        queryParameters: {
          date: 1639423222426
        },
        httpMethod: 'POST',
        functionName: 'meleca'
      },
      output: {
        invoke: false
      }
    },
    {
      event: {
        pathParameters: {
          auth: 'xyz',
          app: 'theAppId'
        },
        queryParameters: {
          date: 1639423222426
        },
        httpMethod: 'PUT',
        functionName: 'meleca'
      },
      output: {
        invoke: false
      }
    },
    {
      event: {
        pathParameters: {
          auth: 'xyz',
          app: 'theAppId'
        },
        queryParameters: {
          date: 1639423222426
        },
        httpMethod: 'PATCH',
        functionName: 'meleca'
      },
      output: {
        invoke: false
      }
    },
    {
      event: {
        headers: {
          appKey: 'FAu0P9UPaH8fUYFcUoKlf8zZMjRlPT9t4BprnLsf',
          'User-Agent': 'PostmanRuntime/7.29.2',
          Accept: '*/*',
          'Cache-Control': 'no-cache',
          'Postman-Token': '9a7cd24e-bc34-44fd-adda-9672450c4e84',
          Host: 'localhost:3013',
          'Accept-Encoding': 'gzip, deflate, br',
          Connection: 'keep-alive',
          'Content-Length': '0'
        },
        httpMethod: 'POST',
        multiValueHeaders: {
          appKey: ['FAu0P9UPaH8fUYFcUoKlf8zZMjRlPT9t4BprnLsf'],
          'User-Agent': ['PostmanRuntime/7.29.2'],
          Accept: ['*/*'],
          'Cache-Control': ['no-cache'],
          'Postman-Token': ['9a7cd24e-bc34-44fd-adda-9672450c4e84'],
          Host: ['localhost:3013'],
          'Accept-Encoding': ['gzip, deflate, br'],
          Connection: ['keep-alive'],
          'Content-Length': ['0']
        },
        multiValueQueryStringParameters: null,
        path: '/activity/v1/integration/app/local/activity/summary/clone',
        pathParameters: { app: 'local' },
        requestContext: {
          accountId: 'offlineContext_accountId',
          apiId: 'offlineContext_apiId',
          authorizer: {
            principalId: 'offlineContext_authorizer_principalId',
            claims: undefined
          },
          httpMethod: 'POST',
          identity: {
            accountId: 'offlineContext_accountId',
            apiKey: 'offlineContext_apiKey',
            caller: 'offlineContext_caller',
            cognitoAuthenticationProvider: 'offlineContext_cognitoAuthenticationProvider',
            cognitoAuthenticationType: 'offlineContext_cognitoAuthenticationType',
            cognitoIdentityId: 'offlineContext_cognitoIdentityId',
            cognitoIdentityPoolId: 'offlineContext_cognitoIdentityPoolId',
            sourceIp: '127.0.0.1',
            user: 'offlineContext_user',
            userAgent: 'PostmanRuntime/7.29.2',
            userArn: 'offlineContext_userArn'
          },
          protocol: 'HTTP/1.1',
          requestId: 'offlineContext_requestId_clbkuls9b000p4ni52ia878jh',
          requestTimeEpoch: 1670852780090,
          resourceId: 'offlineContext_resourceId',
          resourcePath: '/activity/v1/integration/app/{app}/activity/summary/clone',
          stage: 'api'
        },
        resource: '/activity/v1/integration/app/{app}/activity/summary/clone',
        stageVariables: null,
        isOffline: true
      },
      output: {
        invoke: false
      }
    },
    {
      event: {
        headers: {},
        body: {},
        httpMethod: '',
        pathParameters: { appId: 'local' },
        queryStringParameters: {},
        multiValueQueryStringParameters: {},
        requestContext: {},
        multiValueHeaders: {}
      },
      output: {
        invoke: true
      }
    }
  ]

  test.each(data)('Should return if the event was invoked or originated by an API Gateway request', (param) => {
    expect(invokeEventCheck(param.event)).toStrictEqual(param.output)
  })
})
