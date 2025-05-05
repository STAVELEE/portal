import axios from 'axios'

const VULTR_API_KEY = process.env.VULTR_API_KEY

if (!VULTR_API_KEY) {
  console.error('❌ VULTR_API_KEY가 설정되지 않았습니다.')
  throw new Error('VULTR_API_KEY가 설정되지 않았습니다.')
}

const headers = {
  Authorization: `Bearer ${VULTR_API_KEY}`,
  'Content-Type': 'application/json',
}

export async function createInstance(region: string, plan: string, os_id: number | string, label: string) {
  const data = { region, plan, os_id, label }

  console.log('🔧 Vultr 서버 생성 요청 데이터:', data)

  const res = await axios.post('https://api.vultr.com/v2/instances', data, { headers })
  return res.data
}

export async function getInstances() {
  const res = await axios.get('https://api.vultr.com/v2/instances', { headers })
  return res.data
}

export async function getRegions() {
  const res = await axios.get('https://api.vultr.com/v2/regions', { headers })
  return res.data
}

export async function getPlans(type: string) {
  const res = await axios.get(`https://api.vultr.com/v2/plans?type=${type}`, { headers })
  return res.data
}

export async function getOsList() {
  const res = await axios.get('https://api.vultr.com/v2/os', { headers })
  return res.data
}
