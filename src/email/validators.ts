import { getEmailDomain } from './formatters'

export const isEmail = (arg: string): boolean => {
  if (!arg || typeof arg !== 'string') return false

  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(arg)
}

export const hasPublicDomain = (email: string): boolean => {
  if (!isEmail(email)) return false
  const publicEmailDomains = [
    'bol',
    'gmail',
    'hotmail',
    'live',
    'outlook',
    'terra',
    'uol',
    'yahoo'
  ]
  const emailDomain = getEmailDomain(email)

  const isPublic = publicEmailDomains.some(publicDomain => String(emailDomain).includes(`${publicDomain}.com`))
  return isPublic
}
