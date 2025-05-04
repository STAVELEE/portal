import axios from 'axios'

const VULTR_API_KEY = process.env.VULTR_API_KEY!

export async function createInstance(region: string, plan: string, os_id: string, label: string) {
  const res = await axios.post('https://api.vultr.com/v2/instances', {
    region,
    plan,
    os_id,
    label,
  }, {
    headers: {
      Authorization: `Bearer ${VULTR_API_KEY}`,
      'Content-Type': 'application/json'
    }
  })

  return res.data
}
