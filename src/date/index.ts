export interface Duration {
  day?: number
  month?: number
  year?: number
  hour?: number
  minutes?: number
  seconds?: number
  milliseconds?: number
}

export const durationTypes = {
  day: 'Date',
  month: 'Month',
  year: 'FullYear',
  hour: 'Hours',
  minute: 'Minutes',
  second: 'Seconds',
  millisecond: 'Milliseconds'
}

export const increaseDate = (date: Date, duration: Duration): Date => {
  date = changeDate(date, duration)
  return date
}

export const decreaseDate = (date: Date, duration: Duration): Date => {
  for (const type in duration) {
    duration[type] = duration[type] * -1
  }
  date = changeDate(date, duration)
  return date
}

export const changeDate = (date: Date, duration: Duration): Date => {
  for (const type in duration) {
    const setDateType = `set${String(durationTypes[type])}`
    const getDateType = `get${String(durationTypes[type])}`
    date[setDateType](Number(date[getDateType]()) + Number(duration[type]))
  }
  return date
}
