import crypto from 'crypto'
import { InternalError } from '..'

export function encryptPassword (passwordToEncrypt: string, encryptionKey: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const key = crypto.scryptSync(encryptionKey, salt, 24)
  const iv = Buffer.alloc(16, 0)
  const cipher = crypto.createCipheriv('aes-192-cbc', key, iv)
  let encryptedPassword = cipher.update(passwordToEncrypt, 'utf8', 'hex')
  encryptedPassword += cipher.final('hex')
  return `${salt}:${encryptedPassword}`
}

export function decryptPassword (storedPassword, encryptionKey) {
  try {
    const [salt, encryptedPassword] = storedPassword.split(':')
    const key = crypto.scryptSync(encryptionKey, salt, 24)
    const iv = Buffer.alloc(16, 0)
    const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv)
    let decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf8')
    decryptedPassword += decipher.final('utf8')
    return decryptedPassword
  } catch (error) {
    throw new InternalError('Invalid Master Key')
  }
}
