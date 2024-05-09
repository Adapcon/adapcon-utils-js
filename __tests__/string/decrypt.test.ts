import { decryptPassword, encryptPassword } from '../../src/string'

describe('decrypt', () => {
  test('Should decrypt String', () => {
    const hash = encryptPassword('senhavini', 'chave')
    const result = decryptPassword(hash, 'chave')
    const expected = 'senhavini'
    expect(result).toEqual(expected)
  })
})
