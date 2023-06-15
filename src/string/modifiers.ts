export const stringToArray = (str = '', delimiter = ','): string[] => {
  if (typeof str !== 'string' || str === '') return []
  return str.split(delimiter).map((value) => value.trim())
}
