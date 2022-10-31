export const isValidName = (name: string): boolean => {
  const regex = /[0-9]/

  return !regex.test(name)
}
