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
