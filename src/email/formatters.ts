import { isEmail } from './validators'

export const getEmailDomain = (arg: string): string | undefined => {
  return isEmail(arg) ? arg.toLowerCase().split('@').pop() : ''
}
