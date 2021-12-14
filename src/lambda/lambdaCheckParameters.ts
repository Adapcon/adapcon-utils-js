import type { LambdaErrors } from './interfaces'

export const lambdaCheckParameters = (object: object, indexes: string[]): object => {
  const errors: LambdaErrors = {}
  if (Object.keys(object).length > 0 && indexes.length > 0) {
    indexes.forEach(index => {
      errors[index] = { ...(!object[index] ? { error: 'undefined' } : '') }
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      if (index in object) delete errors[index]
    })
  } else {
    errors.param = 'Object is empty'
  }
  return errors
}
