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

      const res2 = await fetch('/api/vultr/instances')
      const instanceData = await res2.json()
      setInstances(instanceData.instances || [])
    } catch (err) {
      setResult({ error: '서버 생성 실패', detail: err })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">🌐 Vultr 서버 생성 포털</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <select name="region" onChange={handleChange} value={form.region}
            className="p-2 border rounded w-48 bg-white">
            <option value="">리전 선택</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>{r.id} - {r.city}</option>
            ))}
          </select>

          <select name="plan" onChange={handleChange} value={form.plan}
            className="p-2 border rounded w-64 bg-white">
            <option value="">플랜 선택</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.vcpu_count}vCPU / {p.ram}MB
              </option>
            ))}
          </select>

          <select name="os_id" onChange={handleChange} value={form.os_id}
            className="p-2 border rounded w-48 bg-white">
            <option value="">OS 선택</option>
            {oses.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>

          <input type="text" name="label" value={form.label} onChange={handleChange}
            placeholder="서버 라벨 입력"
            className="p-2 border rounded w-48 bg-white"
          />

          <button onClick={createServer}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? '생성 중...' : '서버 생성'}
          </button>
        </div>

        {result && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="font-semibold mb-2">📦 생성 결과</h2>
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {instances.length > 0 && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-4">🖥️ 현재 서버 목록</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 border">이름</th>
                    <th className="p-2 border">IP</th>
                    <th className="p-2 border">리전</th>
                    <th className="p-2 border">OS</th>
                    <th className="p-2 border">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {instances.map(ins => (
                    <tr key={ins.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{ins.label}</td>
                      <td className="p-2 border">{ins.main_ip}</td>
                      <td className="p-2 border">{ins.region}</td>
                      <td className="p-2 border">{ins.os}</td>
                      <td className="p-2 border">{ins.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
