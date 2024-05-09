import crypto from 'crypto'
import { InternalError } from '..'

export function encryptPassword (passwordToEncrypt: string, encryptionKey: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const cipher = getCipher(encryptionKey, salt)
  let encryptedPassword = cipher.update(passwordToEncrypt, 'utf8', 'hex')
  encryptedPassword += cipher.final('hex')
  return `${salt}:${encryptedPassword}`
}

export function decryptPassword (storedPassword: string, encryptionKey: string) {
  try {
    const [salt, encryptedPassword] = storedPassword.split(':')
    const cipher = getCipher(encryptionKey, salt)
    let decryptedPassword = cipher.update(encryptedPassword, 'hex', 'utf8')
    decryptedPassword += cipher.final('utf8')
    return decryptedPassword
  } catch (error) {
    throw new InternalError('Invalid Master Key')
  }
}

function getCipher (encryptionKey: string, salt: string) {
  const key = crypto.scryptSync(encryptionKey, salt, 24)
  const iv = Buffer.alloc(16, 0)
  const cipher = crypto.createDecipheriv('aes-192-cbc', key, iv)
  return cipher
}
