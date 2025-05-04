// pages/index.tsx
import { useEffect, useState } from 'react'

export default function Home() {
  const [regions, setRegions] = useState([])
  const [plans, setPlans] = useState([])
  const [oses, setOses] = useState([])
  const [form, setForm] = useState({
    region: '',
    plan: '',
    os_id: '',
    label: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const fetchOptions = async () => {
      const [r, p, o] = await Promise.all([
        fetch('/api/vultr/regions').then(res => res.json()),
        fetch('/api/vultr/plans').then(res => res.json()),
        fetch('/api/vultr/os').then(res => res.json()),
      ])
      setRegions(r.regions)
      setPlans(p.plans)
      setOses(o.os)
    }
    fetchOptions()
  }, [])

  const handleChange = (e: any) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const createServer = async () => {
    setLoading(true)
    const res = await fetch('/api/server/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Vultr 서버 생성</h1>

      <select name="region" onChange={handleChange}>
        <option>리전 선택</option>
        {regions.map((r: any) => (
          <option key={r.id} value={r.id}>{r.id} - {r.city}</option>
        ))}
      </select>

      <select name="plan" onChange={handleChange}>
        <option>플랜 선택</option>
        {plans.map((p: any) => (
          <option key={p.id} value={p.id}>{p.id} - {p.ram}MB RAM</option>
        ))}
      </select>

      <select name="os_id" onChange={handleChange}>
        <option>OS 선택</option>
        {oses.map((o: any) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>

      <input
        name="label"
        placeholder="서버 라벨 입력"
        onChange={handleChange}
      />

      <button onClick={createServer} disabled={loading}>
        {loading ? '생성 중...' : '서버 생성하기'}
      </button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  )
}
