import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/lib/firestore'; // Firebase Admin SDK

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: '인증이 필요합니다.' });
  }

  try {
    const snapshot = await db
      .collection('users')
      .doc(session.user.email)
      .collection('servers')
      .get();

    const instances = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.instanceId,
        label: data.label,
        main_ip: data.main_ip,
        region: data.region,
        os: data.os,
        status: data.status,
      };
    });

    return res.status(200).json({ instances });
  } catch (error: any) {
    console.error('🔥 인스턴스 조회 실패:', error);
    return res.status(500).json({ error: '인스턴스 조회 실패', detail: error.message });
  }
}
