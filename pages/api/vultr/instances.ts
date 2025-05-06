// ✅ pages/api/vultr/instance.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.VULTR_API_KEY;

  // GET 메서드만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'GET 요청만 허용됩니다.' });
  }

  // API 키 확인
  if (!apiKey) {
    return res.status(500).json({ error: 'VULTR_API_KEY 환경변수가 없습니다.' });
  }

  const { id } = req.query;

  // ID 검증
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: '유효한 인스턴스 ID가 필요합니다.' });
  }

  try {
    // Vultr API 호출
    const response = await axios.get(`https://api.vultr.com/v2/instances/${id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const ins = response.data.instance;

    // 필요한 데이터 구조화
    const instance = {
      id: ins.id,
      label: ins.label,
      region: ins.region,
      os: ins.os,
      main_ip: ins.main_ip === '0.0.0.0' ? '할당 중' : ins.main_ip,
      status: formatStatus(ins.status, ins.power_status),
      vcpu_count: ins.vcpu_count,
      ram: ins.ram,
      disk: ins.disk,
      date_created: ins.date_created,
      default_password: ins.default_password || null,
    };

    return res.status(200).json({ instance });
  } catch (error: any) {
    console.error('🔴 인스턴스 조회 실패:', error.response?.data || error.message);

    const status = error.response?.status || 500;
    const detail = error.response?.data || error.message;

    return res.status(status).json({ error: '조회 실패', detail });
  }
}

// 상태 포맷 정리
function formatStatus(status: string, power: string) {
  if (status === 'pending') return '세팅 중';
  if (status === 'active' && power === 'running') return '가동 중';
  if (status === 'active') return '대기 중';
  return status;
}
