import { calcDigitsPositionsCnpj, calcDigitsPositionsCpf } from '../../src/cpfCnpj/utils'

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

describe('calcDigitsPositionsCpf', () => {
  const firstCalc = [
    { input: '773331510', output: '7733315107' },
    { input: '846273460', output: '8462734606' },
    { input: '373950500', output: '3739505001' }
  ]
  const secondCalc = [
    { input: '7733315107', output: '77333151077' },
    { input: '8462734606', output: '84627346069' },
    { input: '3739505001', output: '37395050010' }
  ]

  test.each(firstCalc)('Should return cpf with first digit calculated', (param) => {
    expect(calcDigitsPositionsCpf(param.input)).toBe(param.output)
  })
  test.each(secondCalc)('Should return cpf with two digits calculated', (param) => {
    expect(calcDigitsPositionsCpf(param.input, 11)).toBe(param.output)
  })
})
