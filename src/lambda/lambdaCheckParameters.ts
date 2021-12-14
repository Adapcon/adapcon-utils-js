export const lambdaCheckParameters = (object: object, indexes: string[]): object => {
  const errors = {}
  if (Object.keys(object).length > 0 && indexes.length > 0) {
    indexes.forEach(index => {
      if (!(index in object)) {
        errors[index] = 'undefined'
      }
    })
    return errors
  }

  return { object: 'undefined' }
}
