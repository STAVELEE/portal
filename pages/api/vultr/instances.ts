import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const apiKey = process.env.VULTR_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API 키가 없습니다.' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: '유효한 서버 ID가 필요합니다.' });
  }

  try {
    const { data } = await axios.get(`https://api.vultr.com/v2/instances/${id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const ins = data.instance;

    const instance = {
      id: ins.id,
      label: ins.label,
      region: typeof ins.region === 'string' ? ins.region : ins.region?.id || '-',
      os: typeof ins.os === 'string' ? ins.os : ins.os?.name || '-',
      ram: ins.ram || '-',
      disk: ins.disk || '-',
      vcpu_count: ins.vcpu_count || '-',
      date_created: ins.date_created || '-',
      main_ip: ins.main_ip === '0.0.0.0' ? '할당 중' : ins.main_ip,
      default_password: ins.default_password || null, // 보안상 null 허용
      status: formatStatus(ins.status, ins.power_status),
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
