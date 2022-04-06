import { capitalizeFirstLetter, kebabCaseToCamelCase, removeSpecialCharacters, dynamicVariableSwitcher } from '../../src/string'

describe('capitalizeFirstLetter', () => {
  const data = [{ input: 'teste', output: 'Teste' }, { input: 'TESTE', output: 'TESTE' }, { input: 'alan Reno Neves', output: 'Alan Reno Neves' }]

  test.each(data)('Should return the word with the first letter capitalize', (param) => {
    expect(capitalizeFirstLetter(param.input)).toBe(param.output)
  })
})

describe('kebabCaseToCamelCase', () => {
  const data = [{ input: 'teste-adapcon', output: 'testeAdapcon' },
    { input: 'TESTE', output: 'TESTE' },
    { input: 'alan-Reno-Neves', output: 'alanRenoNeves' }]

  test.each(data)('Should return the kebab-case string in camel case', (param) => {
    expect(kebabCaseToCamelCase(param.input)).toBe(param.output)
  })
})

describe('removeSpecialCharacters', () => {
  const data = [{ input: 'teste-adapcon', output: 'testeadapcon' }, { input: 'Feijão', output: 'Feijo' }, { input: '^^^^^~~~', output: '' }]

  test.each(data)('Should return string without special characters', (param) => {
    expect(removeSpecialCharacters(param.input)).toBe(param.output)
  })
})

describe('dynamicVariableSwitcher', () => {
  const data = [
    {
      inputString: '{{nome_de_contato}}, {{cpf}}, sua documentação esta pronta',
      dynamicVariables: {
        nome_de_contato: 'Marcos',
        cpf: '000.000.000-00',
        email: 'digosw@gmail.com',
        teste: 'teste',
        outraString: 'OLHA QUE LEGAL!!!111ONZE!1'
      },
      returnedString: 'Marcos, 000.000.000-00, sua documentação esta pronta'
    },
    {
      inputString: '{{email}}',
      dynamicVariables: {
        nome_de_contato: 'Marcos',
        cpf: '000.000.000-00',
        email: 'digosw@gmail.com',
        teste: 'teste',
        outraString: 'OLHA QUE LEGAL!!!111ONZE!1'
      },
      returnedString: 'digosw@gmail.com'
    },
    {
      inputString: '{{email}}',
      dynamicVariables: {
        nome_de_contato: 'Marcos',
        cpf: '000.000.000-00',
        email: 'digosw@gmail.com',
        teste: 'teste',
        outraString: 'OLHA QUE LEGAL!!!111ONZE!1'
      },
      returnedString: 'digosw@gmail.com'
    },
    {
      inputString: '{{email}}{{teste}}{{teste2}}',
      dynamicVariables: {
        nome_de_contato: 'Marcos',
        cpf: '000.000.000-00',
        email: 'digosw@gmail.com',
        teste: 'teste',
        outraString: 'OLHA QUE LEGAL!!!111ONZE!1'
      },
      returnedString: 'digosw@gmail.comteste'
    },
    {
      inputString: '{{outraString}} {{testes}}',
      dynamicVariables: {
        nome_de_contato: 'Marcos',
        cpf: '000.000.000-00',
        email: 'digosw@gmail.com',
        teste: 'teste',
        outraString: 'OLHA QUE LEGAL!!!111ONZE!1'
      },
      returnedString: 'OLHA QUE LEGAL!!!111ONZE!1 '
    }
  ]

  test.each(data)('Should switch every regex match with its matching dynamicVariable', (param) => {
    expect(dynamicVariableSwitcher(param.inputString, param.dynamicVariables)).toBe(param.returnedString)
  })
})
