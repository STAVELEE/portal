// pages/api/vultr/instances.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;  // 쿼리에서 서버 ID 받기
  const apiKey = process.env.VULTR_API_KEY;

  // API Key 확인
  if (!apiKey) {
    return res.status(500).json({ error: 'VULTR_API_KEY 환경변수가 없습니다.' });
  }

  // ID가 없거나 문자열이 아닐 경우 400 오류 반환
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: '서버 ID가 유효하지 않습니다.' });
  }

  try {
    // 해당 서버의 정보 요청
    const response = await axios.get(`https://api.vultr.com/v2/instances/${id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    res.status(200).json(response.data);  // 인스턴스 정보 반환
  } catch (error: any) {
    console.error('인스턴스 정보 조회 실패:', error?.response?.data || error.message);
    res.status(500).json({ error: '인스턴스 조회 실패', detail: error?.response?.data || error.message });
  }
}

