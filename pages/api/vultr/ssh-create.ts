// ✅ SSH 키를 자동 생성하는 API
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.VULTR_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API 키 누락됨' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
  }

  const { name, public_key } = req.body;

  if (!name || !public_key) {
    return res.status(400).json({ error: '이름과 공개키가 필요합니다.' });
  }

  try {
    const response = await axios.post('https://api.vultr.com/v2/ssh-keys', {
      name,
      ssh_key: public_key,
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('SSH 키 생성 실패:', error.response?.data || error.message);
    return res.status(500).json({ error: 'SSH 키 생성 실패', detail: error.response?.data || error.message });
  }
}
