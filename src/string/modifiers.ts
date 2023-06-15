export const stringToArray = (str = '', delimiter = ','): string[] => {
  if (typeof str !== 'string' || str === '') return []
  return decodeURIComponent(str).trim().split(delimiter)
}
