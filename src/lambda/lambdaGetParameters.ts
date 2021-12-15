import { camelize } from './../string/formatters/index';
export const lambdaGetParameters = (event: object, eventParams: object): object => {
  const fedParams = {}

  for (const element in eventParams) {
    const path: string = eventParams[element]

    if (path in event) {
      const eventPathObject: object = event[path]
      const fedParam: any = path === 'body' ? eventPathObject : eventPathObject[element]
      if (path === 'headers'){
        fedParams[camelize(element)] = fedParam
      }
      else fedParams[element] = fedParam
      
    }
  }

  return fedParams
}
