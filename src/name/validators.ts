export const isValidName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false

  const regex = /[0-9]/

  return !regex.test(name)
}
