// ✅ /pages/api/server/create.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' })
  }

  const apiKey = process.env.VULTR_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'VULTR_API_KEY 환경변수가 설정되지 않았습니다.' })
  }

  const { region, plan, os_id, label, sshkey_id } = req.body

  if (!region || !plan || !os_id) {
    return res.status(400).json({ error: 'region, plan, os_id는 필수입니다.' })
  }

  try {
    const payload: Record<string, any> = {
      region,
      plan,
      os_id,
      label: label || `server-${Math.floor(Math.random() * 10000)}`,
    }

    if (sshkey_id) payload.sshkey_id = sshkey_id

    const response = await axios.post(
      'https://api.vultr.com/v2/instances',
      payload,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return res.status(200).json({ instance: response.data.instance })
  } catch (error: any) {
    console.error('🔴 서버 생성 실패:', error.response?.data || error.message)
    return res.status(500).json({ error: '서버 생성 실패', detail: error.response?.data || error.message })
  }
}
