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

export const compareJsonDiff = ({ baseObject, compareObject }: { baseObject: object, compareObject: object }) => {
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
        diff[i] = compareObject[i]
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

type MergeObjectChangesOptions = {
  useOldKeysIfNotPresentInNew?: boolean
  addNewKeys?: boolean
}
export function mergeObjectChanges<T> (
  oldObj: T,
  newObj: T,
  options: MergeObjectChangesOptions = {
    useOldKeysIfNotPresentInNew: false,
    addNewKeys: true
  }
): T {
  options.useOldKeysIfNotPresentInNew = options.useOldKeysIfNotPresentInNew ?? false
  options.addNewKeys = options.addNewKeys ?? true

  const result = {} as T

  function checkKeys (obj: T) {
    for (const key in obj) {
      if (Array.isArray(oldObj[key]) && Array.isArray(newObj[key])) {
        result[key] = newObj[key]
      } else if (typeof oldObj[key] === 'object' && typeof newObj[key] === 'object') {
        result[key] = mergeObjectChanges(oldObj[key], newObj[key])
        continue
      }

      if (
        // has key with value on old but not on new
        (newObj[key] === undefined || newObj[key] === null) &&
        (oldObj[key] !== undefined && oldObj[key] !== null) &&
        options.useOldKeysIfNotPresentInNew
      ) {
        result[key] = oldObj[key]
        continue
      } else if (
        // has key with value on new but not on old
        (newObj[key] !== undefined && newObj[key] !== null) &&
        (oldObj[key] === undefined || oldObj[key] === null) &&
          options.addNewKeys
      ) {
        result[key] = newObj[key]
        continue
      } else if (
        // has key with value on both
        (newObj[key] !== undefined && newObj[key] !== null) &&
        (oldObj[key] !== undefined && oldObj[key] !== null)
      ) {
        if (oldObj[key] !== newObj[key]) {
          result[key] = newObj[key]
        } else {
          result[key] = oldObj[key]
        }
      }
    }
  }

  checkKeys(oldObj)
  checkKeys(newObj)

  return result
}
