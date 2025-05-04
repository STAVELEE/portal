// pages/api/vultr/regions.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.VULTR_API_KEY

  if (!apiKey) {
    console.error('❌ 환경변수 누락')
    return res.status(500).json({ error: 'VULTR_API_KEY 환경변수가 없습니다.' })
  }

  try {
    const response = await axios.get('https://api.vultr.com/v2/regions', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    return res.status(200).json(response.data)
  } catch (err: any) {
    console.error('❌ Vultr API 오류:', err.response?.data || err.message)
    return res.status(500).json({ error: 'Vultr API 실패', detail: err.response?.data || err.message })
  }
}
