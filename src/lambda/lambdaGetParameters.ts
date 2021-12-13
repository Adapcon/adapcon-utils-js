export const lambdaGetParameters = ({ event, eventParams }: any): object => {
  const fedParams = {}

  for (const element in eventParams) {
    fedParams[element] = eventParams[element] === 'body' ? event?.[eventParams[element]] : event?.[eventParams[element]]?.[element]
  }

  return fedParams
}
