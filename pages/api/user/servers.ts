import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/lib/firestore';

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

    const servers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json({ servers });
  } catch (error: any) {
    console.error('서버 목록 가져오기 실패:', error);
    return res.status(500).json({ error: '서버 목록 조회 중 오류 발생' });
  }
}
