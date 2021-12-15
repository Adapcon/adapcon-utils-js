import { isString } from '../string'

export const isObject = (obj: any): boolean => {
  return typeof obj === 'object' && obj === Object(obj) && !Array.isArray(obj)
}

export const objToStr = (arg: any): string => ((isString(arg)) ? arg : JSON.stringify(arg))
