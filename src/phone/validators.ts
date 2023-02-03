import { removeFirstDigitFromPhone } from './formatters'

/**
 * Validates the phone number based in the brazilian phone number format
 * You can't use a phone number with country code
 */
export const isBrazilianCellPhoneFormat = (arg: string | number): boolean => {
  if (!arg || (typeof arg !== 'string' && typeof arg !== 'number')) return false

  const regex = /^\(?\d{2}\)?[\s-]?[\s9]?\d{4}-?\d{4}$/

  return regex.test(String(arg))
}

export const isValidPhoneFormat = (arg: string | number): boolean => {
  if (!arg || (typeof arg !== 'string' && typeof arg !== 'number')) return false

  const argFormatted = String(arg).replace(/[- ]/g, '')

  if (isNaN(Number(argFormatted))) return false

  const regexWithoutDDI = /^\(?\d{2}\)?[\s9]?\d{4}?\d{4}$/
  const regexWithDDI = /^\(?\d{2}\)?\(?\d{2}\)?[\s9]?\d{4}?\d{4}$/

  return regexWithoutDDI.test(String(argFormatted)) || regexWithDDI.test(String(argFormatted))
}

export const isSamePhone = (phone1: string, phone2: string): boolean => {
  const phone1Formatted = phone1.slice(0, 2) === '55' ? phone1.slice(2) : phone1
  const phone2Formatted = phone2.slice(0, 2) === '55' ? phone2.slice(2) : phone2

  return removeFirstDigitFromPhone(phone1Formatted) === removeFirstDigitFromPhone(phone2Formatted)
}
