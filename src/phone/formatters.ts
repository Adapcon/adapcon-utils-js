export const formatPhone = (v: string): string => {
  if (!v) return ''

  let value = v
  value = value.replace(/\D/g, '')
  if (value.length === 11) {
    value = value.replace(/(\d{2})(\d)/, '($1) $2')
    value = value.replace(/(\d{5})(\d)/, '$1-$2')
  } else if (value.length === 10) {
    value = value.replace(/(\d{2})(\d)/, '($1) $2')
    value = value.replace(/(\d{4})(\d)/, '$1-$2')
  } else if (value.length === 9) {
    value = value.replace(/(\d{5})(\d)/, '$1-$2')
  } else if (value.length === 8) {
    value = value.replace(/(\d{4})(\d)/, '$1-$2')
  }
  return value
}

export const removeFirstDigitFromPhone = (phone: string): string => {
  if (phone.length === 8 || phone.length === 10 || phone.length === 12) return phone

  const ddd = phone.length === 11 ? phone.slice(0, 2) : ''
  const ddi = phone.length === 13 ? phone.slice(0, 4) : ''
  let phoneWithoutFirstDigit = ''

  if (ddi) { phoneWithoutFirstDigit = phone.slice(5) } else if (ddd) { phoneWithoutFirstDigit = phone.slice(3) } else phoneWithoutFirstDigit = phone.slice(1)

  return `${ddi}${ddd}${phoneWithoutFirstDigit}`
}
