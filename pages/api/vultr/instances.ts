import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'GET 요청만 허용됩니다.' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: '인증된 사용자만 조회할 수 있습니다.' });
  }

  try {
    const snapshot = await getDocs(collection(db, 'users', session.user.email, 'servers'));

    const instances = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ instances });
  } catch (error: any) {
    console.error('🔴 인스턴스 목록 조회 실패:', error.message);
    return res.status(500).json({ error: '인스턴스 목록 호출 실패', detail: error.message });
  }
}
