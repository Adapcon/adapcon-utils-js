export function isValidSQLDatetime (datetime: string | Date): boolean {
  const SQLDateTimeFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/

  const isValid = SQLDateTimeFormat.test(String(datetime)) && !!new Date(datetime)

  return isValid
}
