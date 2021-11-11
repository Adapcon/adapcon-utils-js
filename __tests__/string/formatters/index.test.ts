import { capitalizeFirstLetter } from '../../../src/string'

describe('capitalizeFirstLetter', () => {
  const data = [{input: 'teste', output: 'Teste'}, {input: 'TESTE', output: 'TESTE'}, {input: 'alan Reno Neves', output: 'Alan Reno Neves'}]

  test.each(data)('Should return true if parameter is string', (param) => {
    expect(capitalizeFirstLetter(param.input)).toBe(param.output)
  })
})
