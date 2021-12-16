import { capitalizeFirstLetter, kebabCaseToCamelCase } from '../../src/string'

describe('capitalizeFirstLetter', () => {
  const data = [{ input: 'teste', output: 'Teste' }, { input: 'TESTE', output: 'TESTE' }, { input: 'alan Reno Neves', output: 'Alan Reno Neves' }]

  test.each(data)('Should return the word with the first letter capitalize', (param) => {
    expect(capitalizeFirstLetter(param.input)).toBe(param.output)
  })
})

describe('kebabCaseToCamelCase', () => {
  const data = [{ input: 'teste-adapcon', output: 'testeAdapcon' }, { input: 'TESTE', output: 'TESTE' }, { input: 'alan-Reno-Neves', output: 'alanRenoNeves' }]

  test.each(data)('Should return the kebab-case string in camel case', (param) => {
    expect(kebabCaseToCamelCase(param.input)).toBe(param.output)
  })
})
