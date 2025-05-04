// pages/api/vultr/delete.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.VULTR_API_KEY

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  if (!apiKey || !id || typeof id !== 'string') {
    return res.status(400).json({ error: '잘못된 요청입니다.' })
  }

  try {
    await axios.delete(`https://api.vultr.com/v2/instances/${id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    return res.status(200).json({ success: true })
  } catch (err: any) {
    console.error('삭제 실패:', err.response?.data || err.message)
    return res.status(500).json({ error: '삭제 실패', detail: err.response?.data || err.message })
  }
}