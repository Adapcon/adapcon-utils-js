import { getEmailDomain } from './formatters'

export const isEmail = (arg: string): boolean => {
  if (!arg || typeof arg !== 'string') return false

  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(arg)
}

export const hasPublicDomain = (email: string): boolean => {
  if (!isEmail(email)) return false
  const publicEmailDomain = [
    'bol.com.br',
    'gmail.com',
    'hotmail.com',
    'hotmail.com.br',
    'live.com',
    'outlook.com',
    'terra.com.br',
    'uol.com.br',
    'yahoo.com',
    'yahoo.com.br'
  ]
  const emailDomain = getEmailDomain(email)

  const isPublic = publicEmailDomain.some(publicDomain => publicDomain === emailDomain)
  return isPublic
}
