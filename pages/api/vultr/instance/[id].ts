// pages/api/vultr/instances/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;  // 쿼리에서 서버 ID 받기
  const apiKey = process.env.VULTR_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'VULTR_API_KEY 환경변수가 없습니다.' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: '서버 ID가 유효하지 않습니다.' });
  }

  try {
    const response = await axios.get(`https://api.vultr.com/v2/instances/${id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const instance = response.data.instance;
    instance.main_ip = instance.main_ip === '0.0.0.0' ? '할당 중' : instance.main_ip;
    return res.status(200).json(instance);  // 인스턴스 상세 정보 반환
  } catch (error: any) {
    console.error('인스턴스 정보 조회 실패:', error?.response?.data || error.message);
    return res.status(500).json({ error: '인스턴스 조회 실패', detail: error?.response?.data || error.message });
  }
}
