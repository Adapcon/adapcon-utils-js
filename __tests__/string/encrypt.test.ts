import { encryptPassword } from '../../src/string'

describe('encrypt', () => {
  test('Should encrypt String', () => {
    const result = encryptPassword('senhavini', 'chave')
    expect(typeof result).toEqual('string')
  })
})
