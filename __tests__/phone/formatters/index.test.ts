import { formatPhone } from '../../../src/phone'

describe('formatPhone', () => {
  const data = [
    { input: '123', output: '123' },
    { input: '47996919816', output: '(47) 99691-9816' },
    { input: '4799616039', output: '(47) 9961-6039' },
    { input: '99616039', output: '9961-6039' },
    { input: '999616039', output: '99961-6039' },
    { input: '(47)99719283', output: '(47) 9971-9283' },
    { input: '', output: '' }
  ]

  test.each(data)('Should return the phone number formatted', (param) => {
    expect(formatPhone(param.input)).toBe(param.output)
  })
})
