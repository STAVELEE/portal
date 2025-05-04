import type { NextApiRequest, NextApiResponse } from 'next'
import { createInstance } from '../../../lib/vultr'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { region, plan, os_id, label } = req.body

  try {
    const result = await createInstance(region, plan, os_id, label)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ error: 'Vultr API 호출 실패', detail: error.message })
  }
}
