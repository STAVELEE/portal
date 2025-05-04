import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body

  if (password === process.env.ADMIN_SECRET) {
    res.setHeader('Set-Cookie', `ADMIN_SECRET=${process.env.NEXT_PUBLIC_ADMIN_SECRET}; Path=/dashboard; Max-Age=3600`)
    return res.status(200).json({ success: true })
  }

  return res.status(401).json({ error: '비밀번호가 틀렸습니다.' })
}
