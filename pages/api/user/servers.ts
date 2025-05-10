import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: '로그인한 사용자만 접근할 수 있습니다.' })
  }

  try {
    const q = query(
      collection(db, 'servers'),
      where('userEmail', '==', session.user.email)
    )
    const snapshot = await getDocs(q)
    const servers = snapshot.docs.map(doc => doc.data())

    return res.status(200).json({ servers })
  } catch (error: any) {
    console.error('❌ 서버 목록 조회 실패:', error.message)
    return res.status(500).json({ error: '서버 목록 조회 실패', detail: error.message })
  }
}
