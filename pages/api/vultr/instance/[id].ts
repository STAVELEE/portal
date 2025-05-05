import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const apiKey = process.env.VULTR_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'VULTR_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  if (!id) {
    return res.status(400).json({ error: '서버 ID가 제공되지 않았습니다.' });
  }

  try {
    const response = await axios.get(`https://api.vultr.com/v2/instances/${id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Vultr 서버 정보 가져오기 실패:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Vultr 서버 정보 가져오기 실패', detail: error.response?.data || error.message });
  }
}
