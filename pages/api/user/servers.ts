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
    const serversRef = db.collection('servers');
    const snapshot = await serversRef.where('userEmail', '==', session.user.email).get();

    const servers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ servers });
  } catch (error: any) {
    console.error('🔥 서버 목록 조회 실패:', error);
    return res.status(500).json({ error: '서버 목록 조회 실패', detail: error.message });
  }
}
