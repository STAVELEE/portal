import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const VULTR_API_KEY = process.env.VULTR_API_KEY

  if (!VULTR_API_KEY) {
    console.error("❌ 환경변수 VULTR_API_KEY가 없습니다.")
    return res.status(500).json({ error: '환경변수가 누락되었습니다.' })
  }

  try {
    const response = await axios.get('https://api.vultr.com/v2/regions', {
      headers: { Authorization: `Bearer ${VULTR_API_KEY}` }
    })
    res.status(200).json(response.data)
  } catch (error: any) {
    console.error("❌ Vultr API 호출 실패:", error.response?.data || error.message)
    res.status(500).json({ error: 'Vultr API 호출 실패', detail: error.response?.data || error.message })
  }
}
