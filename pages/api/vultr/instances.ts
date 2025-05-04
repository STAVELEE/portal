// pages/api/vultr/instances.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.VULTR_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'VULTR_API_KEY 없음' })
  }

  try {
    const response = await axios.get('https://api.vultr.com/v2/instances', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    return res.status(200).json(response.data)
  } catch (err: any) {
    console.error('인스턴스 불러오기 실패:', err.response?.data || err.message)
    return res.status(500).json({ error: '불러오기 실패', detail: err.response?.data || err.message })
  }
}
