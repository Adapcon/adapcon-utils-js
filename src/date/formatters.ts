export const formatDate = (date: string, format: string = 'DD/MM/YYYY'): string => {
  const [year, month, day] = date.split('-')

  return format.replace('DD', day).replace('MM', month).replace('YYYY', year)
}
