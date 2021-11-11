import { isNumber } from '../../src/number'

describe('isNumber', () => {
  const validNumbers = [123, 1, 2, 5, Number(1), 100000000, 123.31, '123', '01', '123.31', String(1)]
  const invalidNumbers = ['- 01', 'cookie', ' 1 3 5', '"1"']

  test.each(validNumbers)('Should return true if parameter is number', (param) => {
    expect(isNumber(param)).toBe(true)
  })

  test.each(invalidNumbers)('Should return false if parameter is not a number', (param) => {
    expect(isNumber(param)).toBe(false)
  })
})
