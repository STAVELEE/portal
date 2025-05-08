// pages/api/vultr/password.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// @ts-ignore - formidable 타입 무시
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
    return res.status(405).json({ error: '허용되지 않은 메서드입니다. POST만 가능' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('formidable 파싱 오류:', err);
      return res.status(500).json({ error: '파일 파싱 실패' });
    }

    const instanceId = fields.id?.[0];
    if (!instanceId) {
      return res.status(400).json({ error: '서버 ID 누락' });
    }

    const file = files.privateKey?.[0];
    if (!file) {
      return res.status(400).json({ error: '키 파일 누락' });
    }

    try {
      const keyContent = await fs.readFile(file.filepath, 'utf-8');
      const encryptedRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/vultr/instance?id=${instanceId}`);
      const encryptedData = await encryptedRes.json();

      if (!encryptedRes.ok) {
        return res.status(500).json({ error: '서버 데이터 조회 실패' });
      }

      const decrypted = decryptWithPrivateKey(encryptedData.instance.default_password, keyContent);
      return res.status(200).json({ password: decrypted });
    } catch (error: any) {
      console.error('복호화 오류:', error);
      return res.status(500).json({ error: '비밀번호 복호화 실패' });
    }
  });
}
