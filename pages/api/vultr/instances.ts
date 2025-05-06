// pages/api/vultr/instance.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.VULTR_API_KEY;
  const { id } = req.query;

  if (!apiKey) {
    return res.status(500).json({ error: 'VULTR_API_KEY 환경변수가 없습니다.' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'GET 요청만 허용됩니다.' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: '유효한 인스턴스 ID가 필요합니다.' });
  }

  try {
    const response = await axios.get(`https://api.vultr.com/v2/instances/${id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const ins = response.data.instance;

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
    return res.status(500).json({
      error: '인스턴스 조회 실패',
      detail: error.response?.data || error.message,
    });
  }
}

function formatStatus(status: string, power: string) {
  if (status === 'pending') return '세팅 중';
  if (status === 'active' && power === 'running') return '가동 중';
  if (status === 'active') return '대기 중';
  return status;
}
