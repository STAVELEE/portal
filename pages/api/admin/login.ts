// pages/api/admin/login.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret) return res.status(500).json({ error: '서버에 비밀번호가 설정되지 않았습니다.' })

  if (password === adminSecret) {
    res.setHeader('Set-Cookie', `admin=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`)
    return res.status(200).json({ success: true })
  } else {
    return res.status(401).json({ error: '비밀번호가 틀렸습니다.' })
  }
}
