import type { Duration } from './interfaces'
import { DurationTypes } from './enums'

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
    const setDateType = `set${String(DurationTypes[type])}`
    const getDateType = `get${String(DurationTypes[type])}`
    updatedDate[setDateType](Number(updatedDate[getDateType]()) + Number(duration[type]))
  }

  return updatedDate
}

export const getDiffDays = (date: string, initial?: string): number => {
  const initialDate = initial ? new Date(initial) : new Date()
  const target = new Date(date)

  const diffTime = Math.abs(initialDate.getTime() - target.getTime())

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return initial ? diffDays : (diffDays - 1)
}
