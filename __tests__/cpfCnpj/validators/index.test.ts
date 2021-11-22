import { isCnpj } from '../../../src/cpfCnpj'

describe('isCnpj', () => {
  const validCnpj = [
    '10874456000134',
    '73631864000185',
    '43667564000195'
  ]
  const invalidCnpj = [
    '108744500135',
    '479980796',
    '43.667.564/0001-96',
    '108744500135108744500135',
    ''
  ]

  test.each(validCnpj)('Should return true', (param) => {
    expect(isCnpj(param)).toBeTruthy()
  })
  test.each(invalidCnpj)('Should return false', (param) => {
    expect(isCnpj(param)).toBeFalsy()
  })
})
