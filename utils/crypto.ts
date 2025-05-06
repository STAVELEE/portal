import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secret = process.env.ENCRYPT_SECRET!;
const key = crypto.createHash('sha256').update(secret).digest();
const iv = Buffer.alloc(16, 0); // 고정 IV (단순화 용도)

export function encrypt(text: string) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decrypt(encrypted: string) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
