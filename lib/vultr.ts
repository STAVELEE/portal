// lib/vultr.ts

import axios from 'axios'

const VULTR_API_KEY = process.env.VULTR_API_KEY!

export async function createInstance(region: string, plan: string, os_id: string, label: string) {
  const data = { region, plan, os_id, label }

  console.log("🔧 Vultr 서버 생성 요청 데이터:", data)

  const res = await axios.post('https://api.vultr.com/v2/instances', data, {
    headers: {
      Authorization: `Bearer ${VULTR_API_KEY}`,
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
