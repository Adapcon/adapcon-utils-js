import { isValidElectronicKey } from '../../src/invoice'

describe('isValidElectronicKey', () => {
  const validElectronicKeys = ['42123454968453231211000025641562232421455852', '42123454968453231211000025641562232421455458']
  const invalidElectronicKeys = ['1234', '123454968453231211000']

  test.each(validElectronicKeys)('Should return true if parameter is a electronic key', (param) => {
    expect(isValidElectronicKey(param)).toBe(true)
  })

  test.each(invalidElectronicKeys)('Should return false if parameter is not a electronic key', (param) => {
    expect(isValidElectronicKey(param)).toBe(false)
  })
})
