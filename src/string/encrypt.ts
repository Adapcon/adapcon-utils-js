import crypto from 'crypto'

export function encryptPassword (passwordToEncrypt, encryptionKey) {
  const salt = crypto.randomBytes(16).toString('hex')
  const key = crypto.scryptSync(encryptionKey, salt, 24)
  const iv = Buffer.alloc(16, 0)
  const cipher = crypto.createCipheriv('aes-192-cbc', key, iv)
  let encryptedPassword = cipher.update(passwordToEncrypt, 'utf8', 'hex')
  encryptedPassword += cipher.final('hex')
  return salt + ':' + encryptedPassword
}

export function decryptPassword (storedPassword, encryptionKey) {
  const [salt, encryptedPassword] = storedPassword.split(':')
  const key = crypto.scryptSync(encryptionKey, salt, 24)
  const iv = Buffer.alloc(16, 0)
  const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv)
  let decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf8')
  decryptedPassword += decipher.final('utf8')
  return decryptedPassword
}
