export const lambdaGetParameters = ({ event, eventParams }: any): object => {
  const fedParams = {}

  for (const element in eventParams) {
    const path: string = eventParams[element]

    if (path in event) {
      const eventPathObject: object = event[path]
      const fedParam: any = path === 'body' ? eventPathObject : eventPathObject[element]
      fedParams[element] = fedParam
    }
  }

  return fedParams
}
