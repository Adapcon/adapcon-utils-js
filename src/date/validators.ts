export function isValidSQLDatetime (datetime: string): boolean {
  const SQLDateTimeFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/

  const isValid = SQLDateTimeFormat.test(String(datetime)) && !!new Date(datetime).valueOf()

  return isValid
}
