import { isValidName } from '../../src/name'

describe('isValidName', () => {
  const validNames = ['Gabriel', 'João', 'Paula', 'Glicério', 'Ana']

  test.each(validNames)('Should return true if the name is valid', (name) => {
    expect(isValidName(name)).toBeTruthy()
  })

  const invalidNames = ['Patríc1a', 'An4 Pau1a', '007', 'jOÃO c4rlos', 307]

  test.each(invalidNames)('Should return false if the name is invalid', (notName) => {
    expect(isValidName(notName as any)).toBeFalsy()
  })
})
