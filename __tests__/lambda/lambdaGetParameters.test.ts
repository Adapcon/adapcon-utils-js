import { lambdaGetParameters } from '../../src/lambda'

describe('lambdaGetParameters', () => {
  const data = [
    {
      event: {
        pathParameters: {
          auth: 'xyz',
          app: 'theAppId'
        },
        queryParameters: {
          date: 1639423222426
        }
      },
      eventParams: {
        auth: 'pathParameters',
        app: 'pathParameters',
        date: 'queryParameters'
      },
      output: {
        auth: 'xyz',
        app: 'theAppId',
        date: 1639423222426
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
        }
      },
      eventParams: {},
      output: {}
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
        body: {
          key1: 'data1',
          key2: 'data2',
          key3: 'data3'
        }
      },
      eventParams: {
        auth: 'pathParameters',
        app: 'pathParameters',
        body: 'body'
      },
      output: {
        auth: 'xyz',
        app: 'theAppId',
        body: {
          key1: 'data1',
          key2: 'data2',
          key3: 'data3'
        }
      }
    },
    {
      event: {
        pathParameters: {
          auth: 'xyz',
          app: 'theAppId'
        }
      },
      eventParams: {
        date: 'queryParameters'
      },
      output: {}
    },
    {
      event: {
        pathParameters: {
          auth: 'xyz',
          app: 'theAppId'
        }
      },
      eventParams: {},
      output: {}
    },
    {
      event: {
        body: {
          key1: 'data1',
          key2: 'data2',
          key3: 'data3'
        }
      },
      eventParams: {
        body: 'body'
      },
      output: {
        body: {
          key1: 'data1',
          key2: 'data2',
          key3: 'data3'
        }
      }
    },
    {
      event: {},
      eventParams: {},
      output: {}
    },
    {
      event: {
        pathParameters: {
          auth: 'xyz',
          app: 'theAppId'
        },
        queryParameters: {
          date: 1639423222426
        }
      },
      eventParams: {
        auth: 'zyx'
      },
      output: {}
    }
  ]

  test.each(data)('Should return an populated object, with parameters passed on eventParams', (param) => {
    expect(lambdaGetParameters({ event: param.event, eventParams: param.eventParams })).toStrictEqual(param.output)
  })
})
