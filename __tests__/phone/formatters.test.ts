import { formatPhone, removeFirstDigitFromPhone } from '../../src/phone'

describe('formatPhone', () => {
  const data = [
    { input: '123', output: '123' },
    { input: '47996919816', output: '(47) 99691-9816' },
    { input: '4799616039', output: '(47) 9961-6039' },
    { input: '99616039', output: '9961-6039' },
    { input: '999616039', output: '99961-6039' },
    { input: '(47)99719283', output: '(47) 9971-9283' },
    { input: '(47)999719283', output: '(47) 99971-9283' },
    { input: '', output: '' }
  ]

  test.each(data)('Should return the phone number formatted', (param) => {
    expect(formatPhone(param.input)).toBe(param.output)
  })
})

describe('removeFirstDigitFromPhone', () => {
  const data = [
    { input: '5547996919816', output: '554796919816' },
    { input: '554796919816', output: '554796919816' },
    { input: '47996919816', output: '4796919816' },
    { input: '4796919816', output: '4796919816' },
    { input: '996919816', output: '96919816' },
    { input: '96919816', output: '96919816' }
  ]

  test.each(data)('Should return the phone without the first digit', (param) => {
    expect(removeFirstDigitFromPhone(param.input)).toBe(param.output)
  })
})
