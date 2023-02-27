export const isValidName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false

  const regex = /[0-9]/

  return !regex.test(name)
}

export const isValidFullName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false

  const regex = /^([A-ZÑ]('[A-Z][a-záàâãéèêíïóôõöúçñ]|[a-záàâãéèêíïóôõöúçñ]){1,}\s([A-ZÑ][a-záàâãéèêíïóôõöúçñ](.*[^A-Z]){1,}|[a-zñ][a-záàâãéèêíïóôõöúçñ](.*[^A-Z]){1,}'?-?\s?[A-Z][a-záàâãéèêíïóôõöúçñ](.*[^A-Z]){1,}))/

  return regex.test(name)
}
