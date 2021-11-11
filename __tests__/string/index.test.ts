import { isString } from '../../src/string'

describe('isString', () => {
  const validStrings = ['cookie', '- 2', '5', String(1), '1 3 5', '123.31', '"1"']
  const invalidStrings = [123, 1, {}, { music: 'on' }, Number(1), [10, '0', 'apple'], 123.31]

  test.each(validStrings)('Should return true if parameter is string', (param) => {
    expect(isString(param)).toBe(true)
  })

  test.each(invalidStrings)('Should return true if parameter is not a string', (param) => {
    expect(isString(param)).toBe(false)
  })
})
