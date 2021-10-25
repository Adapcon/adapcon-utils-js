import { isString } from '../string';

export const isObject = (obj: any) => {
  return typeof obj === 'object' && obj === Object(obj) && !Array.isArray(obj);
}

export const objToStr = (arg: any) => ((isString(arg)) ? arg : JSON.stringify(arg));
