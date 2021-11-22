import { calcDigitsPositionsCnpj } from '../../../src/cpfCnpj/utils'

describe('calcDigitsPositionsCnpj', () => {
  const firstCalc = [
    { input: '108744560001', output: '1087445600013' },
    { input: '736318640001', output: '7363186400018' },
    { input: '436675640001', output: '4366756400019' }
  ]
  const secondCalc = [
    { input: '1087445600013', output: '10874456000134' },
    { input: '7363186400018', output: '73631864000185' },
    { input: '4366756400019', output: '43667564000195' }
  ]
  const errorCalc = [
    { input: '1087445600013', output: '10874456000131' },
    { input: '7363186400018', output: '73631864000185' },
    { input: '4366756400019', output: '43667564000199' }
  ]

  test.each(firstCalc)('Should return cnpj with first digit calculated', (param) => {
    expect(calcDigitsPositionsCnpj(param.input, 5, 0)).toBe(param.output)
  })
  test.each(secondCalc)('Should return cnpj with two digits calculated', (param) => {
    expect(calcDigitsPositionsCnpj(param.input, 6)).toBe(param.output)
  })
  test.each(errorCalc)('Should return cnpj with wrong digits calculated', (param) => {
    expect(calcDigitsPositionsCnpj(param.input)).toBe(param.output)
  })
})
