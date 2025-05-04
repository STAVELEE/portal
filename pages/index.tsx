// pages/index.tsx
import { useEffect, useState } from 'react'
import useAdmin from '../lib/useAdmin'

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
    if (!type) return
    const fetchPlans = async () => {
      const res = await fetch(`/api/vultr/plans?type=${type}`)
      const data = await res.json()
      setPlans(data.plans || [])
    }
    fetchPlans()
  }, [type])

  if (!mounted) return null

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

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

    // 1. 생성된 서버를 목록에 임시 추가 (상태는 pending)
    setInstances(prev => [
      {
        id: data.instance.id,
        label: data.instance.label,
        main_ip: '0.0.0.0',
        region: data.instance.region,
        os: data.instance.os,
        status: 'pending'
      },
      ...prev
    ])

    // 2. 일정 시간 후 실제 서버 목록 갱신
    setTimeout(async () => {
      const updated = await fetch('/api/vultr/instances').then(res => res.json())
      setInstances(updated.instances || [])
    }, 5000)

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">🌐 Vultr 서버 생성 포털</h1>

        <div className="flex flex-wrap gap-4 mb-4">
          <select name="region" onChange={handleChange} value={form.region} className="p-2 border rounded w-48">
            <option value="">리전 선택</option>
            {regions.map(r => (
              <option key={r.id} value={r.id}>{r.country} - {r.city}</option>
            ))}
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)} className="p-2 border rounded w-64" disabled={!form.region}>
            <option value="">서버 타입 선택</option>
            <option value="vc2">Cloud Compute (vc2)</option>
            <option value="vhf">High Frequency (vhf)</option>
            <option value="vdc">Dedicated (vdc)</option>
            <option value="voc-g">General Purpose (voc-g)</option>
            <option value="voc-c">CPU Optimized (voc-c)</option>
            <option value="voc-m">Memory Optimized (voc-m)</option>
          </select>

          <select name="plan" onChange={handleChange} value={form.plan} className="p-2 border rounded w-64" disabled={!type}>
            <option value="">플랜 선택</option>
            {plans.map(p => (
              <option key={p.id} value={p.id}>{p.id} - {p.vcpu_count}vCPU / {p.ram}MB</option>
            ))}
          </select>

          <select name="os_id" onChange={handleChange} value={form.os_id} className="p-2 border rounded w-48">
            <option value="">OS 선택</option>
            {oses.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>

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

        {result?.instance && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="font-semibold mb-2">📦 생성 결과</h2>
            <ul className="text-sm text-gray-800">
              <li>🔑 비밀번호: {result.instance.default_password}</li>
              <li>📛 라벨: {result.instance.label}</li>
              <li>🖥 OS: {result.instance.os}</li>
              <li>📶 상태: {result.instance.status}</li>
            </ul>
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
                  <td className="p-2 border">
                    {ins.status === 'pending' ? '🛠️ 세팅중' : ins.status === 'active' ? '✅ 운영중' : ins.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
