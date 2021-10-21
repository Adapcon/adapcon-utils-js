import { isNumber } from '../../src/number'

describe('isNumber', () => {
  const validNumbers = [123, 1, 2, 5, Number(1), 100000000, 123.31]

  test.each(validNumbers)('Should return true if parameter is number', (param) => {
    expect(isNumber(param)).toBe(true)
  })
})
