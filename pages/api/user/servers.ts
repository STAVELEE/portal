import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'GET 요청만 허용됩니다.' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: '인증이 필요합니다.' });
  }

  try {
    const serversRef = collection(db, 'servers');
    const q = query(serversRef, where('userEmail', '==', session.user.email));
    const snapshot = await getDocs(q);

    const servers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json({ servers });
  } catch (error: any) {
    console.error('🔴 서버 목록 불러오기 실패:', error.message);
    return res.status(500).json({ error: '서버 목록 불러오기 실패', detail: error.message });
  }
}
