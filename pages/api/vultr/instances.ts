// ✅ /pages/api/vultr/instances.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth' // ✅ 추가

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions) as Session // ✅ 타입 단언 추가

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: '인증이 필요합니다.' })
  }

  const apiKey = process.env.VULTR_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'VULTR_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  try {
    const response = await axios.get('https://api.vultr.com/v2/instances', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('🔴 인스턴스 조회 실패:', error.response?.data || error.message);
    return res.status(500).json({
      error: '인스턴스 조회 실패',
      detail: error.response?.data || error.message,
    });
  }
}

