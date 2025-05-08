// utils/cryptoUtils.ts
import crypto from 'crypto';

export function decryptWithPrivateKey(encryptedBase64: string, privateKey: string): string {
  const buffer = Buffer.from(encryptedBase64, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    buffer
  );
  return decrypted.toString('utf-8');
}
