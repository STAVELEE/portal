// pages/api/vultr/regions.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const VULTR_API_KEY = process.env.VULTR_API_KEY

  if (!VULTR_API_KEY) {
    return res.status(500).json({ error: '환경변수가 없습니다' })
  }

  try {
    const response = await axios.get('https://api.vultr.com/v2/regions', {
      headers: { Authorization: `Bearer ${VULTR_API_KEY}` }
    })
    res.status(200).json(response.data)
  } catch (err: any) {
    res.status(500).json({
      error: 'Vultr API 호출 실패',
      detail: err.response?.data || err.message,
    })
  }
}
