import { useEffect, useState } from 'react'

export default function Home() {
  const [regions, setRegions] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [oses, setOses] = useState<any[]>([])
  const [instances, setInstances] = useState<any[]>([])

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
        setRegions(r.regions || [])
        setPlans(p.plans || [])
        setOses(o.os || [])
      } catch (err) {
        console.error('옵션 로딩 실패:', err)
      }
    }

    const loadInstances = async () => {
      try {
        const res = await fetch('/api/vultr/instances')
        const data = await res.json()
        setInstances(data.instances || [])
      } catch (err) {
        console.error('인스턴스 불러오기 실패:', err)
      }
    }

    fetchOptions()
    loadInstances()
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

      // 생성 후 목록 갱신
      const res2 = await fetch('/api/vultr/instances')
      const instanceData = await res2.json()
      setInstances(instanceData.instances || [])
    } catch (err) {
      setResult({ error: '서버 생성 실패', detail: err })
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🌐 Vultr 서버 생성</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        <select name="region" onChange={handleChange} value={form.region}>
          <option value="">리전 선택</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>{r.id} - {r.city}</option>
          ))}
        </select>

        <select name="plan" onChange={handleChange} value={form.plan}>
          <option value="">플랜 선택</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id} - {p.vcpu_count}vCPU / {p.ram}MB
            </option>
          ))}
        </select>

        <select name="os_id" onChange={handleChange} value={form.os_id}>
          <option value="">OS 선택</option>
          {oses.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
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
          <h3>📦 생성 결과</h3>
          <pre style={{ background: '#eee', padding: '1rem' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {instances.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2>🖥️ 현재 서버 목록</h2>
          <table border={1} cellPadding={8}>
            <thead>
              <tr>
                <th>이름</th>
                <th>IP</th>
                <th>리전</th>
                <th>OS</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {instances.map((ins) => (
                <tr key={ins.id}>
                  <td>{ins.label}</td>
                  <td>{ins.main_ip}</td>
                  <td>{ins.region}</td>
                  <td>{ins.os}</td>
                  <td>{ins.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
