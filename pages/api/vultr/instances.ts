import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.VULTR_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'VULTR_API_KEY 환경변수가 없습니다.' })
  }

  try {
    const response = await axios.get('https://api.vultr.com/v2/instances', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    const instances = (response.data.instances || []).map((ins: any) => ({
      id: ins.id,
      label: ins.label,
      region: ins.region,
      os: ins.os,
      main_ip: ins.main_ip === '0.0.0.0' ? '할당 중' : ins.main_ip,
      status: formatStatus(ins.status, ins.power_status),
    }))

    return res.status(200).json({ instances })
  } catch (error: any) {
    console.error('🔴 인스턴스 목록 조회 실패:', error.response?.data || error.message)
    return res.status(500).json({ error: '인스턴스 목록 호출 실패' })
  }
}

function formatStatus(status: string, power: string) {
  if (status === 'pending') return '세팅 중'
  if (status === 'active' && power === 'running') return '가동 중'
  if (status === 'active') return '대기 중'
  return status
}
