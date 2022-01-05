export const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)

export const kebabCaseToCamelCase = (str: string): string => str.replace(/-./g, x => x[1].toUpperCase())
