export const invokeEventCheck = (event: {[key: string]: any}): boolean => {
  return !(('requestContext' in event) && !!(Object.keys(event.requestContext).length))
}
