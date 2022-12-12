import { formatDate } from '../../src/date/formatters'

describe('formatDate', () => {
  const currentDate = new Date()
  const month = currentDate.getMonth() + 1
  const day = currentDate.getDate()

  const dates = [
    { input: '2022-05-15', format: 'DD/MM/YYYY', output: '15/05/2022' },
    { input: '2022-05-15', format: 'YYYY-DD-MM', output: '2022-15-05' },
    { input: '2022-05-15', format: 'YYYY/MM/DD', output: '2022/05/15' },
    { input: '2022-05-15', format: 'MM/DD/YYYY', output: '05/15/2022' },
    { input: currentDate, format: 'DD-MM-YYYY', output: `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${currentDate.getFullYear()}` },
    { input: currentDate, format: 'YYYY-MM-DD', output: `${currentDate.getFullYear()}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}` },
    { input: new Date('2022/07/07'), format: 'DD-MM-YYYY', output: '07-07-2022' }
  ]

  test.each(dates)('Should return formatted date passing the format', (param) => {
    expect(formatDate(param.input, param.format)).toBe(param.output)
  })

  it('Should return formatted date without passing the format', () => {
    expect(formatDate('2022-05-19')).toBe('19/05/2022')
  })
})
