/**
 * Validates the phone number based in the brazilian phone number format
 * You can't use a phone number with country code
 */
export const isBrazilianCellPhone = (arg: string | number): boolean => {
  if (!arg || (typeof arg !== 'string' && typeof arg !== 'number')) return false

  const regex = /^\(?\d{2}\)?[\s-]?[\s9]?\d{4}-?\d{4}$/

  return regex.test(String(arg))
}
