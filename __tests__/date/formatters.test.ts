import { formatDate } from '../../src/date/formatters'

describe('formatDate', () => {
  const dates = [
    { input: '2022-05-15', format: 'DD/MM/YYYY', output: '15/05/2022' },
    { input: '2022-05-15', format: 'YYYY-DD-MM', output: '2022-15-05' },
    { input: '2022-05-15', format: 'YYYY/MM/DD', output: '2022/05/15' },
    { input: '2022-05-15', format: 'MM/DD/YYYY', output: '05/15/2022' }
  ]

  test.each(dates)('Should return formatted date passing the format', (param) => {
    expect(formatDate(param.input, param.format)).toBe(param.output)
  })

  it('Should return formatted date without passing the format', () => {
    expect(formatDate('2022-05-19')).toBe('19/05/2022')
  })
})
