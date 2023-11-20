import { kebabCaseToCamelCase } from './../string/formatters'
export const lambdaGetParameters = (event: object, eventParams: object): { [key: string]: any } => {
  const fedParams = {}

  for (const element in eventParams) {
    if (Object.prototype.hasOwnProperty.call(eventParams, element)) {
      const path: string = eventParams[element]

      if (path in event) {
        const eventPathObject: object = event[path]
        if (!eventPathObject) continue
        const fedParam: any = path === 'body' ? eventPathObject : eventPathObject[element]
        let paramKey: string = element
        if (path === 'headers') {
          paramKey = kebabCaseToCamelCase(element)
        }
        fedParams[paramKey] = fedParam
      }
    }
  }

  return fedParams
}
