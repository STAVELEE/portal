// pages/api/ssh/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { generateKeyPairSync } from 'crypto';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.VULTR_API_KEY;

  if (req.method !== 'POST') return res.status(405).json({ error: 'POST만 허용됩니다.' });
  if (!apiKey) return res.status(500).json({ error: 'VULTR_API_KEY 없음' });

  try {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
    });

    const name = `key-${Date.now()}`;
    const vultrRes = await axios.post(
      'https://api.vultr.com/v2/ssh-keys',
      { name, ssh_key: publicKey },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json({ name, privateKey, key: vultrRes.data.ssh_key });
  } catch (error: any) {
    console.error('키 생성 실패:', error.response?.data || error.message);
    return res.status(500).json({ error: '키 생성 실패', detail: error.response?.data || error.message });
  }
}
