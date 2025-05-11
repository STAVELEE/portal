import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import axios from 'axios'
import { saveInstanceToFirestore } from '@/lib/firestore'
import { sendServerInfoEmail } from '@/lib/sendMail'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.email) {
    return res.status(401).json({ error: '인증이 필요합니다.' })
  }

  const apiKey = process.env.VULTR_API_KEY
  const { region, plan, os_id, label, sshkey_id } = req.body

  try {
    const response = await axios.post('https://api.vultr.com/v2/instances', {
      region, plan, os_id, label, sshkey_id
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    const instance = response.data.instance
    await saveInstanceToFirestore(session.user.email, instance)
    await sendServerInfoEmail(session.user.email, {
      label: instance.label,
      ip: instance.main_ip || '할당 중',
      password: instance.default_password || '(확인 불가)',
    })

    res.status(200).json({ instance })
  } catch (e: any) {
    res.status(500).json({ error: '서버 생성 실패', detail: e.message })
  }
}
