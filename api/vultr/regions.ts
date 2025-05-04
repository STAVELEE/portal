// pages/api/vultr/regions.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const VULTR_API_KEY = process.env.VULTR_API_KEY!
  const response = await axios.get('https://api.vultr.com/v2/regions', {
    headers: { Authorization: `Bearer ${VULTR_API_KEY}` }
  })
  res.status(200).json(response.data)
}
