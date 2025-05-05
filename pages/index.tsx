import { useEffect, useState } from 'react'
import useAdmin from '../lib/useAdmin'
import { filterPlansByRegion } from '../utils/filterPlansByRegion'


export default function Home() {
  const [mounted, setMounted] = useState(false)
  const isAdmin = useAdmin()

  const [type, setType] = useState('')
  const [regions, setRegions] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [oses, setOses] = useState<any[]>([])
  const [instances, setInstances] = useState<any[]>([])

  const [form, setForm] = useState({ region: '', plan: '', os_id: '', label: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchOptions = async () => {
      const [r, o] = await Promise.all([
        fetch('/api/vultr/regions').then(res => res.json()),
        fetch('/api/vultr/os').then(res => res.json()),
      ])
      setRegions(r.regions || [])
      setOses(o.os || [])
    }

    const loadInstances = async () => {
      const res = await fetch('/api/vultr/instances')
      const data = await res.json()
      setInstances(data.instances || [])
    }

    fetchOptions()
    loadInstances()
  }, [])

  useEffect(() => {
    if (!type || !form.region) return
    const fetchPlans = async () => {
      const res = await fetch(`/api/vultr/plans?type=${type}`)
      const data = await res.json()
      const filtered = filterPlansByRegion(data.plans || [], form.region, type)
      setPlans(filtered)
    }
    fetchPlans()
  }, [type, form.region])
  

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const renderStatus = (status: string) => {
    switch (status) {
      case 'active': return '✅ 가동중'
      case 'pending': return '🛠 세팅 중...'
      case 'stopped': return '⛔ 중지됨'
      case 'locked': return '🔒 잠김'
      default: return status
    }
  }

  const waitForServerReady = async (label: string, maxRetries = 10, delay = 3000) => {
    for (let i = 0; i < maxRetries; i++) {
      const res = await fetch('/api/vultr/instances')
      const data = await res.json()
      const matched = data.instances?.find((ins: any) => ins.label === label)

      if (matched) {
        if (matched.status !== 'pending') return data.instances
        setInstances(data.instances) // 중간 상태 보여주기
      }

      await new Promise((resolve) => setTimeout(resolve, delay))
    }
    return []
  }

  const createServer = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    let label = form.label.trim() || `nebulax-server-${Math.floor(1000 + Math.random() * 9000)}`
    const exists = instances.some((ins) => ins.label === label)
    if (exists) {
      setError('❌ 이미 존재하는 서버 이름입니다.')
      setLoading(false)
      return
    }

    const payload = { ...form, label }

    const res = await fetch('/api/server/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setResult(data)

    const updatedInstances = await waitForServerReady(label)
    setInstances(updatedInstances)
    setLoading(false)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">🌐 Vultr 서버 생성 포털</h1>

        <div className="flex flex-wrap gap-4 mb-4">
          {/* 리전 */}
          <select name="region" onChange={handleChange} value={form.region} className="p-2 border rounded w-48">
            <option value="">리전 선택</option>
            {regions.map(r => (
              <option key={r.id} value={r.id}>{r.country} - {r.city}</option>
            ))}
          </select>

          {/* 서버 타입 */}
          <select value={type} onChange={(e) => setType(e.target.value)} className="p-2 border rounded w-64" disabled={!form.region}>
            <option value="">서버 타입 선택</option>
            <option value="vc2">Cloud Compute (vc2)</option>
            <option value="vhf">High Frequency (vhf)</option>
            <option value="vdc">Dedicated (vdc)</option>
            <option value="voc-g">General Purpose (voc-g)</option>
            <option value="voc-c">CPU Optimized (voc-c)</option>
            <option value="voc-m">Memory Optimized (voc-m)</option>
          </select>

          {/* 플랜 */}
          <select name="plan" onChange={handleChange} value={form.plan} className="p-2 border rounded w-64" disabled={!type}>
            <option value="">플랜 선택</option>
            {plans.map(p => (
              <option key={p.id} value={p.id}>{p.id} - {p.vcpu_count}vCPU / {p.ram}MB</option>
            ))}
          </select>

          {/* OS */}
          <select name="os_id" onChange={handleChange} value={form.os_id} className="p-2 border rounded w-48">
            <option value="">OS 선택</option>
            {oses.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>

          {/* 라벨 */}
          <input
            type="text"
            name="label"
            value={form.label}
            onChange={handleChange}
            placeholder="서버 라벨 (선택)"
            className="p-2 border rounded w-48"
          />

          <button onClick={createServer} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {loading ? '⏳ 생성 중...' : '🚀 서버 생성'}
          </button>
        </div>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        {result && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="font-semibold mb-2">📦 생성 결과</h2>
            <pre className="text-sm text-gray-700 overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-4">🖥️ 현재 서버 목록</h2>
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
              {instances.map((ins) => (
                <tr key={ins.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{ins.label}</td>
                  <td className="p-2 border">{ins.main_ip}</td>
                  <td className="p-2 border">{ins.region}</td>
                  <td className="p-2 border">{ins.os}</td>
                  <td className="p-2 border">{renderStatus(ins.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
