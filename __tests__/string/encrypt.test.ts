import { encryptPassword } from '../../src/string'

describe('encrypt', () => {
  test('Should encrypt String', () => {
    const result = encryptPassword('senhavini', 'chave')
    const expected = 'b7c8bf5b28f640ee053a4b7879ca12b0:3d4227d5dd4751f022f16a08b582ccc8'
    expect(result).toEqual(expected)
  })
})
