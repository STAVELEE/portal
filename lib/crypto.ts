import crypto from 'crypto'

const algorithm = 'aes-256-cbc'
const secret = process.env.ENCRYPT_SECRET || ''
const iv = Buffer.alloc(16, 0) // 고정 IV (실서비스는 랜덤 IV 추천)

export function encrypt(text: string): string {
  const key = crypto.createHash('sha256').update(secret).digest()
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

export function decrypt(encrypted: string): string {
  const key = crypto.createHash('sha256').update(secret).digest()
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
