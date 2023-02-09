import { isString } from '../string'

export const isObject = (obj: any): boolean => {
  return typeof obj === 'object' && obj === Object(obj) && !Array.isArray(obj)
}

export const objToStr = (arg: any): string => ((isString(arg)) ? arg : JSON.stringify(arg))

export const isObjEqual = (a: any, b: any): boolean => {
  if (a === b) return true
  if (a === null || a === undefined || b === null || b === undefined) return false
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b
  if (a.prototype !== b.prototype) return false
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false
  return keys.every(k => isObjEqual(a[k], b[k]))
}

export const hasOwnProperty = (obj: any, key: string) => Object.prototype.hasOwnProperty.call(obj, key)

export const compareJsonDiff = ({ baseObject = {}, compareObject = {} }: { baseObject: any, compareObject: any }) => {
  const diff = {}
  const removed: string[] = []
  Object.keys(compareObject).forEach(i => {
    if (
      !hasOwnProperty(baseObject, i) ||
      compareObject[i] !== baseObject[i] ||
      !hasOwnProperty(compareObject, i)
    ) {
      if (
        !(JSON.stringify(compareObject[i]) === JSON.stringify(baseObject[i])) &&
        !(!compareObject[i] && !baseObject[i])
      ) {
        if (compareObject[i] === '') removed.push(i)
        else diff[i] = compareObject[i]
      }
    }
  })

  Object.keys(baseObject).forEach(i => {
    if (
      hasOwnProperty(baseObject, i) &&
      !hasOwnProperty(compareObject, i)
    ) removed.push(i)
  })

  return { diff, removed }
}
