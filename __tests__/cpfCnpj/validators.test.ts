import { isCnpj, isCpf } from '../../src/cpfCnpj'

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

describe('isCpf', () => {
  const validCpf = [
    '77333151077',
    '84627346069',
    '37395050010'
  ]
  const invalidCpf = [
    '77333151078',
    '479980796',
    '373.950.500-10',
    '3739505001084627346069',
    ''
  ]

  test.each(validCpf)('Should return true', (param) => {
    expect(isCpf(param)).toBeTruthy()
  })
  test.each(invalidCpf)('Should return false', (param) => {
    expect(isCpf(param)).toBeFalsy()
  })
})
