// pages/api/vultr/instance.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import axios from 'axios'

// Firebase Admin 초기화
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (typeof id !== 'string') {
    return res.status(400).json({ error: '잘못된 서버 ID입니다.' })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: '인증이 필요합니다.' })
  }

  try {
    // ✅ Firebase에서 서버가 해당 사용자 소유인지 확인
    const userServerRef = db
      .collection('users')
      .doc(session.user.email)
      .collection('servers')
      .doc(id)

    const docSnap = await userServerRef.get()

    if (!docSnap.exists) {
      return res.status(403).json({ error: '해당 서버에 접근 권한이 없습니다.' })
    }

    // ✅ Vultr API로 인스턴스 세부정보 가져오기
    const apiKey = process.env.VULTR_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'VULTR_API_KEY가 설정되지 않았습니다.' })
    }

    const response = await axios.get(`https://api.vultr.com/v2/instances/${id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    return res.status(200).json({ instance: response.data.instance })
  } catch (error: any) {
    console.error('🔴 서버 정보 가져오기 실패:', error.response?.data || error.message)
    return res.status(500).json({ error: '서버 정보 조회 실패', detail: error.response?.data || error.message })
  }
}
