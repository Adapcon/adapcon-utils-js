import type { Duration } from './duration'

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
  const decreases = {}
  for (const type in duration) {
    decreases[type] = duration[type] * -1
  }
  date = changeDate(date, decreases)
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
