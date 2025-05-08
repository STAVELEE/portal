// pages/api/vultr/password.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import { decryptWithPrivateKey } from '@/utils/cryptoUtils';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.VULTR_API_KEY;
  const { id } = req.query;

  if (!apiKey) return res.status(500).json({ error: 'VULTR_API_KEY 미설정' });
  if (!id || typeof id !== 'string') return res.status(400).json({ error: '유효한 서버 ID가 필요합니다.' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });

  try {
    const form = new formidable.IncomingForm();
    const [fields, files] = await form.parse(req);
    const pemFile = files.pem?.[0];

    if (!pemFile || !pemFile.filepath) return res.status(400).json({ error: 'PEM 키 파일이 필요합니다.' });

    const pemContent = await fs.readFile(pemFile.filepath, 'utf8');

    const response = await axios.get(`https://api.vultr.com/v2/instances/${id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const encrypted = response.data?.instance?.default_password;

    if (!encrypted) return res.status(404).json({ error: '암호화된 비밀번호가 없습니다.' });

    // 복호화 시도
    const decrypted = await decryptWithPrivateKey(encrypted, pemContent);
    return res.status(200).json({ password: decrypted });
  } catch (err: any) {
    console.error('🔑 비밀번호 복호화 실패:', err.message);
    return res.status(500).json({ error: '복호화 실패', detail: err.message });
  }
}
