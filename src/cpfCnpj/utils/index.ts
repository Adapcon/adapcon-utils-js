export const calcDigitsPositionsCnpj = (digits: string, positions = 10, sumDigits = 0): string => {
  digits = String(digits)

  for (let i = 0; i < digits.length; i++) {
    sumDigits += (Number(digits[i]) * positions)
    positions--
    if (positions < 2) positions = 9
  }

  sumDigits %= 11
  if (sumDigits < 2) sumDigits = 0
  else sumDigits = 11 - sumDigits

  return digits + String(sumDigits)
}

export const calcDigitsPositionsCpf = (digits: string, positions = 10, sumDigits = 0): string => {
  digits = digits.toString()
  let equalDigits = true

  for (let i = 0; i < digits.length; i++) {
    if (digits[i] !== digits[i - 1] && i !== 0) equalDigits = false

    sumDigits += (Number(digits[i]) * positions)
    positions--
  }

  sumDigits %= 11
  if (sumDigits < 2) sumDigits = 0
  else sumDigits = 11 - sumDigits

  if (equalDigits) return '0'

  return digits + String(sumDigits)
};
