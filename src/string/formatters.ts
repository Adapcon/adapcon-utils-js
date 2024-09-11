export const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)

export const kebabCaseToCamelCase = (str: string): string => str.replace(/-./g, x => x[1].toUpperCase())

const CLEAR_REGEX = /[^a-zA-Z0-9\u00C0-\u017F ]/gu
const FULL_CLEAR_REGEX = /[^a-zA-Z0-9 ]/gu

/**
 * Removes special characters from a string.
 *
 * @param str - The input string.
 * @param fullClean - Optional. Specifies whether to perform a full clean or not. Default is true.
 * @returns The string with special characters removed.
 *
 * @example removeSpecialCharacters('Jaraguá do Sul') // 'Jaraguá do Sul'
 * @example removeSpecialCharacters('Jaraguá do Sul/-!') // 'Jaraguá do Sul'
 * @example removeSpecialCharacters('Jaraguá do Sul/-!', true) // 'Jaragu do Sul'
 */
export function removeSpecialCharacters (str: string, fullClean = true): string {
  return str.replace(fullClean ? FULL_CLEAR_REGEX : CLEAR_REGEX, '')
}

export const dynamicVariableSwitcher = (
  textContainingVariables: string,
  dynamicVariables: { [key: string]: string },
  searchRegexPattern = /{{[A-Za-z0-9_]+}}/g,
  variableCleanerPattern = /[{}]/g
) => textContainingVariables.replace(searchRegexPattern, match => {
  const dynamicVariableKey = match.replace(variableCleanerPattern, '')
  return dynamicVariables[dynamicVariableKey] || ''
})
