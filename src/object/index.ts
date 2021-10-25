export const isObject = (obj: any) => {
  return typeof obj === 'object' && obj === Object(obj) && !Array.isArray(obj);
}
