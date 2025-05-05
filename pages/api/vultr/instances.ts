import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.VULTR_API_KEY;

  // ID 값이 URL에서 전달되도록 확인
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: '서버 ID가 유효하지 않습니다.' })
  }

  try {
    const response = await axios.get(`https://api.vultr.com/v2/instances/${id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('인스턴스 정보 조회 실패:', error?.response?.data || error.message);
    res.status(500).json({ error: '인스턴스 조회 실패', detail: error?.response?.data || error.message });
  }
}
