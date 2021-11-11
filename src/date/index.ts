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

export const increaseDate = (date: Date, duration: Duration): Date => changeDate(date, duration)

export const decreaseDate = (date: Date, duration: Duration): Date => {
  const decreases = {}

  for (const type in duration) {
    decreases[type] = duration[type] * -1
  }

  return changeDate(date, decreases)
}

export const changeDate = (date: Date, duration: Duration): Date => {
  const updatedDate = date

  for (const type in duration) {
    const setDateType = `set${String(durationTypes[type])}`
    const getDateType = `get${String(durationTypes[type])}`
    updatedDate[setDateType](Number(updatedDate[getDateType]()) + Number(duration[type]))
  }

  return updatedDate
}
