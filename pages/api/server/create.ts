import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import axios from 'axios'
import { saveInstanceToFirestore } from '@/lib/firestore'
import { sendServerInfoEmail } from '@/lib/sendMail'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' })
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: '인증이 필요합니다.' });
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

    const instance = response.data.instance

    // Firestore 저장
    await saveInstanceToFirestore(session.user.email, instance)

    // 메일 발송
    await sendServerInfoEmail(session.user.email, {
      label: instance.label,
      ip: instance.main_ip || '할당 중',
      password: instance.default_password || '(확인 불가)',
    })

    return res.status(200).json({ instance })
  } catch (error: any) {
    console.error('🔴 서버 생성 실패:', error.response?.data || error.message)
    return res.status(500).json({ error: '서버 생성 실패', detail: error.response?.data || error.message })
  }
}
