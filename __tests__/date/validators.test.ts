
import { isValidSQLDatetime } from '../../src/date/validators'

describe('isValidSQLDatetime', () => {
  const dates = [
    { input: '2022-02-04 12:10:20', output: true },
    { input: '2022-12-30 23:59:59', output: true },
    { input: '2022/02/04 12:10:20', output: false },
    { input: '2022-02-04 12-10-20', output: false }
  ]

  test.each(dates)('Should return if datetime is a valid SQLDatetime', (param) => {
    expect(isValidSQLDatetime(param.input)).toBe(param.output)
  })
})
