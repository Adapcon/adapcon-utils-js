const nullValuesTypes = [undefined, null, '']

export const lambdaCheckParameters = (object: object, indexes: string[]): object => {
  if (Object.keys(object).length === 0 || indexes.length === 0) { return { object: 'undefined' } }

  return indexes.reduce((errors, value) => {
    if (!(value in object)) {
      errors[value] = 'undefined'
    } else if (nullValuesTypes.some(nullValue => nullValue === object[value])) {
      errors[value] = 'null'
    }
    return errors
  }, {})
}
