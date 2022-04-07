export const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)

export const kebabCaseToCamelCase = (str: string): string => str.replace(/-./g, x => x[1].toUpperCase())

export const removeSpecialCharacters = (str: string): string => str.replace(/[^a-zA-Z0-9 ]/g, '')

export const dynamicVariableSwitcher = (
  textContainingVariables: string,
  dynamicVariables: { [key: string]: string },
  searchRegexPattern = /{{[A-Za-z0-9_]+}}/g,
  variableCleanerPattern = /[{}]/g
) => textContainingVariables.replace(searchRegexPattern, match => {
  const dynamicVariableKey = match.replace(variableCleanerPattern, '')
  return dynamicVariables[dynamicVariableKey] || ''
})
