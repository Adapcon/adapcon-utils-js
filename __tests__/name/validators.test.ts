import { isValidName, isValidFullName } from '../../src/name'

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

describe('isValidFullName', () => {
  const validFullNames = ['Gabriel Silva', 'Pafuncio Neto', 'João Carlos', 'Paula dos Santos', 'Marco Polo', 'Glicério da Silva', 'Ana Paula', 'Ja Morant', 'Jorge dos Santos', 'O\'Brain Jef', 'Bobby Cox', 'Jarvin Ñunes']

  test.each(validFullNames)('Should return true if the full name is valid', (fullName) => {
    expect(isValidFullName(fullName)).toBeTruthy()
  })

  const invalidFullNames = ['Patríc1a', 'An4 Pau1a', '007', 'jOÃO c4rlos', 307, 'ãtonio Carlos', 'Ja ã Tonio', 'gabriel Rocha', 'Jorge das beiras', 'Jorge da silVa', 'Paulo nEto', 'JJ Boss', 'JaJa das Motos', 'O\'BRian Jorg']

  test.each(invalidFullNames)('Should return false if the full name is invalid', (notFullName) => {
    expect(isValidFullName(notFullName as any)).toBeFalsy()
  })
})
