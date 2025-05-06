// ✅ pages/api/sshkey/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { generateKeyPairSync } from 'crypto';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
  }

  const apiKey = process.env.VULTR_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'VULTR_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  try {
    // 🔐 SSH 키 생성
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    // 📡 Vultr에 공개키 등록
    const response = await axios.post(
      'https://api.vultr.com/v2/ssh-keys',
      {
        name: `portal-key-${Date.now()}`,
        ssh_key: publicKey,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const keyId = response.data.ssh_key?.id;

    return res.status(200).json({
      id: keyId,
      privateKey,
      message: '🔑 SSH 키가 생성 및 등록되었습니다. 비공개 키는 안전하게 보관하세요.',
    });
  } catch (error: any) {
    console.error('SSH 키 생성 실패:', error.response?.data || error.message);
    return res.status(500).json({ error: 'SSH 키 생성 실패', detail: error.response?.data || error.message });
  }
}
