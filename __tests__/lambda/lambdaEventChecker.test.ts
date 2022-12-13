import { invokeEventCheck } from '../../src/lambda'
import { lambdaRequestEventExample, lambdaInvokeEventExample } from './eventMock'

describe('invokeEventCheck', () => {
  const data = [
    {
      event: {
        ...lambdaRequestEventExample
      },
      output: {
        invoke: false
      }
    },
    {
      event: {
        ...lambdaInvokeEventExample
      },
      output: {
        invoke: true
      }
    },
    {
      event: {
        ...lambdaRequestEventExample,
        httpMethod: 'POST'
      },
      output: {
        invoke: false
      }
    },
    {
      event: {
        ...lambdaRequestEventExample,
        httpMethod: 'PUT'
      },
      output: {
        invoke: false
      }
    },
    {
      event: {
        ...lambdaRequestEventExample,
        httpMethod: 'PATCH'
      },
      output: {
        invoke: false
      }
    }
  ]

  test.each(data)('Should return if the event was invoked or originated by an API Gateway request', (param) => {
    expect(invokeEventCheck(param.event as {requestContext?: {}})).toStrictEqual(param.output)
  })
})
