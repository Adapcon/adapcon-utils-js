export const formatDate = (date: string | Date, format = 'DD/MM/YYYY'): string => {
  let year: string | number = ''
  let month: string | number = ''
  let day: string | number = ''

  if (date instanceof Date) {
    day = date.getDate()
    month = date.getMonth() + 1
    year = date.getFullYear()

    if (day < 10) day = `0${day}`
    if (month < 10) month = `0${month}`
  } else {
    [year, month, day] = date.split('-')
  }

  return format.replace('DD', String(day)).replace('MM', String(month)).replace('YYYY', String(year))
}
