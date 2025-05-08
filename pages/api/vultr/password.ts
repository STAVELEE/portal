// pages/api/vultr/password.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import { decryptWithPrivateKey } from '@/utils/cryptoUtils';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('formidable 파싱 오류:', err);
      return res.status(500).json({ error: '파일 파싱 실패' });
    }

    const file = files?.key;
    if (!file || Array.isArray(file)) {
      return res.status(400).json({ error: '키 파일이 필요합니다.' });
    }

    const keyPath = file.filepath;
    const encryptedPassword = fields?.encryptedPassword as string;

    try {
      const privateKey = await fs.readFile(keyPath, 'utf-8');
      const decrypted = decryptWithPrivateKey(encryptedPassword, privateKey);
      return res.status(200).json({ password: decrypted });
    } catch (err: any) {
      console.error('복호화 실패:', err.message);
      return res.status(500).json({ error: '복호화 실패' });
    }
  });
}
