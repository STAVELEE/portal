import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { sendServerInfoEmail } from '@/lib/sendMail'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const apiKey = process.env.VULTR_API_KEY
  const { region, plan, os_id, label } = req.body

  if (!apiKey) return res.status(500).json({ error: 'API Key 없음' })

  try {
    const response = await axios.post(
      'https://api.vultr.com/v2/instances',
      {
        region,
        plan,
        os_id,
        label,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const instance = response.data.instance

    // ✅ 메일 발송 - 수신 이메일 주소는 사용자 인증이 있다면 사용자의 이메일로
    await sendServerInfoEmail('user@example.com', {
      label: instance.label,
      ip: instance.main_ip || '할당 중',
      password: instance.default_password || '(확인 불가)',
    })

    return res.status(200).json({ instance })
  } catch (err: any) {
    console.error('🔴 서버 생성 실패:', err.response?.data || err.message)
    return res.status(500).json({ error: '서버 생성 실패', detail: err.response?.data || err.message })
  }
}
