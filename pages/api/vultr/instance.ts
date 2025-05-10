import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: '인증된 사용자만 접근할 수 있습니다.' });
  }

  const apiKey = process.env.VULTR_API_KEY;
  const { id } = req.query;

  if (!apiKey) {
    return res.status(500).json({ error: 'VULTR_API_KEY 환경변수가 없습니다.' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: '유효한 인스턴스 ID가 필요합니다.' });
  }

  try {
    // ✅ Firebase에서 서버가 해당 사용자 소유인지 확인
    const userServerRef = doc(db, 'users', session.user.email, 'servers', id);
    const docSnap = await getDoc(userServerRef);

    if (!docSnap.exists()) {
      return res.status(403).json({ error: '이 서버에 접근할 수 없습니다.' });
    }

    // ✅ Vultr API에서 상세 정보 가져오기
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
    };

    return res.status(200).json({ instance });
  } catch (error: any) {
    console.error('🔴 인스턴스 조회 실패:', error.response?.data || error.message);
    return res.status(500).json({ error: '서버 조회 실패', detail: error.response?.data || error.message });
  }
}

function formatStatus(status: string, power: string) {
  if (status === 'pending') return '세팅 중';
  if (status === 'active' && power === 'running') return '가동 중';
  if (status === 'active') return '대기 중';
  return status;
}
