import { useEffect, useState } from 'react'

export default function Home() {
  const [regions, setRegions] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [oses, setOses] = useState<any[]>([])

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
      try {
        const [r, p, o] = await Promise.all([
          fetch('/api/vultr/regions').then(res => res.json()),
          fetch('/api/vultr/plans').then(res => res.json()),
          fetch('/api/vultr/os').then(res => res.json()),
        ])

        console.log('🌍 regions', r)
        console.log('💾 plans', p)
        console.log('🧠 oses', o)

        setRegions(r.regions || [])
        setPlans(p.plans || [])
        setOses(o.os || [])
      } catch (err) {
        console.error('옵션 불러오기 실패:', err)
      }
    }

    fetchOptions()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const createServer = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/server/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: '요청 실패', detail: err })
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🌐 Vultr 서버 생성</h1>

      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <select name="region" onChange={handleChange} value={form.region}>
          <option value="">리전 선택</option>
          {regions.map(r => (
            <option key={r.id} value={r.id}>
              {r.id} - {r.city}
            </option>
          ))}
        </select>

        <select name="plan" onChange={handleChange} value={form.plan}>
          <option value="">플랜 선택</option>
          {plans.map(p => (
            <option key={p.id} value={p.id}>
              {p.id} - {p.vcpu}vCPU / {p.ram}MB
            </option>
          ))}
        </select>

        <select name="os_id" onChange={handleChange} value={form.os_id}>
          <option value="">OS 선택</option>
          {oses.map(o => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="label"
          placeholder="서버 라벨 입력"
          value={form.label}
          onChange={handleChange}
        />

        <button onClick={createServer} disabled={loading}>
          {loading ? '생성 중...' : '서버 생성하기'}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>🔍 생성 결과:</h3>
          <pre style={{ background: '#eee', padding: '1rem' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
