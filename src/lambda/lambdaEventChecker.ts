export const invokeEventCheck = (event: {[key: string]: any}): {invoke: boolean} => {
  if ('requestContext' in event) {
    if (Object.keys(event.requestContext as object).length) {
      return {
        invoke: false
      }
    }
  }
  return { invoke: true }
}
