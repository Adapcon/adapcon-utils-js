export const invokeEventCheck = (event: {[key: string]: any}): boolean => {
  if (('requestContext' in event) && (Object.keys(event.requestContext as object).length)) {
    return false
  }
  return true
}
