import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import type { Session } from 'next-auth'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions) as Session

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: '인증이 필요합니다.' })
  }

  const apiKey = process.env.VULTR_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'VULTR API KEY가 누락되었습니다.' })

  try {
    const response = await axios.get('https://api.vultr.com/v2/instances', {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    res.status(200).json(response.data)
  } catch (err: any) {
    console.error(err.response?.data || err.message)
    res.status(500).json({ error: 'Vultr 인스턴스 조회 실패', detail: err.response?.data || err.message })
  }
}
