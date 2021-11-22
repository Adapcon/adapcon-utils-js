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
