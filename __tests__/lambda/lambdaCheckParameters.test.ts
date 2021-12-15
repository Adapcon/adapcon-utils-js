import { lambdaCheckParameters } from '../../src/lambda/lambdaCheckParameters'

describe('lambdaCheckParameters', () => {
  const data = [
    {
      eventObject: {
        auth: 'xyz',
        app: 'theAppId',
        date: 1639423222426
      },
      indexes: ['auth', 'app'],
      output: {}
    },
    {
      eventObject: {
        app: 'theAppId',
        auth: 'zyx',
        body: {
          data1: 'data1',
          data2: 'data2',
          data3: 'data3'
        },
        date: 1639423222426
      },
      indexes: ['auth', 'app', 'body'],
      output: {}
    },
    {
      eventObject: {
        app: 'theAppId',
        auth: 'zyx',
        body: {
          data1: 'data1',
          data2: 'data2',
          data3: 'data3'
        },
        date: 1639423222426
      },
      indexes: ['auth', 'app', 'date'],
      output: {}
    }
  ]

  test.each(data)('Should return an empty object (no errors)', (param) => {
    expect(lambdaCheckParameters(param.eventObject, param.indexes)).toStrictEqual(param.output)
  })
})

describe('lambdaCheckParameters', () => {
  const data = [
    {
      eventObject: {
        app: 'theAppId',
        auth: 'zyx',
        date: 1639423222426
      },
      indexes: ['auth', 'app', 'body'],
      output: { body: 'undefined' }
    },
    {
      eventObject: {
        app: 'theAppId',
        date: 1639423222426
      },
      indexes: ['auth', 'app', 'body'],
      output: { auth: 'undefined', body: 'undefined' }
    },
    {
      eventObject: {},
      indexes: ['auth', 'app'],
      output: { object: 'undefined' }
    },
    {
      eventObject: {
        auth: {},
        app: '',
        date: 1639423222426
      },
      indexes: ['auth', 'app'],
      output: {}
    }
  ]

  test.each(data)('Should return an object with all the errors', (param) => {
    expect(lambdaCheckParameters(param.eventObject, param.indexes)).toStrictEqual(param.output)
  })
})
