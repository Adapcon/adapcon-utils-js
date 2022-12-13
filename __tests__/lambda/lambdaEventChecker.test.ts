import { invokeEventCheck } from '../../src/lambda'
import { lambdaRequestEventExample, lambdaInvokeEventExample } from './eventMock'

describe('invokeEventCheck', () => {
  const data = [
    {
      event: {
        ...lambdaRequestEventExample
      },
      output: false
    },
    {
      event: {
        ...lambdaInvokeEventExample
      },
      output: true
    },
    {
      event: {
        ...lambdaRequestEventExample,
        httpMethod: 'POST'
      },
      output: false
    },
    {
      event: {
        ...lambdaRequestEventExample,
        httpMethod: 'PUT'
      },
      output: false
    },
    {
      event: {
        ...lambdaRequestEventExample,
        httpMethod: 'PATCH'
      },
      output: false
    }
  ]

  test.each(data)('Should return if the event was invoked or originated by an API Gateway request', (param) => {
    expect(invokeEventCheck(param.event)).toStrictEqual(param.output)
  })
})
