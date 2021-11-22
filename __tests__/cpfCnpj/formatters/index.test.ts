import { formatCnpj } from '../../../src/cpfCnpj'

describe('formatCnpj', () => {
  const validCnpj = [
    { input: '10874456000134', output: '10.874.456/0001-34' },
    { input: '73631864000185', output: '73.631.864/0001-85' },
    { input: '43667564000195', output: '43.667.564/0001-95' }
  ]
  const invalidCnpj = [
    { input: '108744500135', output: '' },
    { input: '479980796', output: '' },
    { input: '43.667.564/0001-96', output: '' },
    { input: '108744500135108744500135', output: '' },
    { input: '', output: '' }
  ]

  test.each(validCnpj)('Should return the cnpj formatted', (param) => {
    expect(formatCnpj(param.input)).toBe(param.output)
  })
  test.each(invalidCnpj)('Should return a empty string', (param) => {
    expect(formatCnpj(param.input)).toBe(param.output)
  })
})
