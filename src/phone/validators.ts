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

export const isSamePhone = (phone1: string, phone2: string): boolean => {
  return removeFirstDigitFromPhone(phone1) === removeFirstDigitFromPhone(phone2)
}
