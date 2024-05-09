import { decryptPassword } from '../../src/string'

describe('decrypt', () => {
  test('Should decrypt String', () => {
    const result = decryptPassword('b7c8bf5b28f640ee053a4b7879ca12b0:3d4227d5dd4751f022f16a08b582ccc8', 'chave')
    const expected = 'senhavini'
    expect(result).toEqual(expected)
  })
})
