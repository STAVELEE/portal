import type { NextApiRequest, NextApiResponse } from 'next'
import { createInstance } from '../../../lib/vultr'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { region, plan, os_id, label } = req.body

    const sanitizedLabel = (label || '')
      .trim()
      .replace(/\s+/g, '-')              // 공백 → 하이픈
      .replace(/[^a-zA-Z0-9-_]/g, '')    // 특수문자 제거

    const result = await createInstance(region, plan, Number(os_id), sanitizedLabel)
    res.status(200).json(result)
  } catch (error: any) {
    console.error('❌ 생성 실패:', error.response?.data || error.message)
    res.status(500).json({
      error: 'Vultr API 호출 실패',
      detail: error.response?.data?.error || error.message,
    })
  }
}
