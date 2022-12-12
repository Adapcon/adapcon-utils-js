export const invokeEventCheck = (event: {[key: string]: any}): {invoke: boolean} => {
  if (!event?.httpMethod) return { invoke: true }
  return { invoke: false }
}
