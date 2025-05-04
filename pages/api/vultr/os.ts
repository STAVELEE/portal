// pages/api/vultr/os.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.VULTR_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'VULTR_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  try {
    const response = await axios.get('https://api.vultr.com/v2/os', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Vultr OS API 호출 실패:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Vultr OS API 호출 실패', detail: error.response?.data || error.message });
  }
}
