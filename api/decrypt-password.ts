// pages/api/decrypt-password.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { privateDecrypt } from 'crypto';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
  }

  const { privateKey, encryptedPassword } = req.body;

  if (!privateKey || !encryptedPassword) {
    return res.status(400).json({ error: '개인키와 암호화된 비밀번호가 필요합니다.' });
  }

  try {
    const buffer = Buffer.from(encryptedPassword, 'base64');
    const decrypted = privateDecrypt(
      {
        key: privateKey,
        padding: 1, // RSA_PKCS1_PADDING
      },
      buffer
    ).toString('utf-8');

    return res.status(200).json({ password: decrypted });
  } catch (err: any) {
    console.error('복호화 실패:', err);
    return res.status(500).json({ error: '복호화 중 오류 발생', detail: err.message });
  }
}
