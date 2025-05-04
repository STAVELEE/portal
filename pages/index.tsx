// index.tsx
// ✅ 생성 애니메이션, 자동 라벨, 중복 방지, 삭제(관리자만)
import { useEffect, useState } from 'react'
import useAdmin from '../lib/useAdmin'


const isAdmin = useAdmin()

export default function Home() {
  const [regions, setRegions] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [oses, setOses] = useState<any[]>([])
  const [instances, setInstances] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ region: '', plan: '', os_id: '', label: '' })
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOptions = async () => {
      const [r, p, o] = await Promise.all([
        fetch('/api/vultr/regions').then(res => res.json()),
        fetch('/api/vultr/plans').then(res => res.json()),
        fetch('/api/vultr/os').then(res => res.json()),
      ])
      setRegions(r.regions || [])
      setPlans(p.plans || [])
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

    const updated = await fetch('/api/vultr/instances').then(res => res.json())
    setInstances(updated.instances || [])
    setLoading(false)
  }

  const deleteInstance = async (id: string) => {
    if (!confirm('정말 삭제할까요?')) return
    await fetch(`/api/vultr/delete?id=${id}`, { method: 'DELETE' })
    const updated = await fetch('/api/vultr/instances').then(res => res.json())
    setInstances(updated.instances || [])
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">🌐 Vultr 서버 생성 포털</h1>

        <div className="flex flex-wrap gap-4 mb-4">
          <select name="region" onChange={(e) => setForm({ ...form, region: e.target.value })} value={form.region} className="p-2 border rounded w-48">
            <option value="">리전 선택</option>
            {regions.map(r => <option key={r.id} value={r.country}>{r.city}</option>)}
          </select>

          <select name="plan" onChange={(e) => setForm({ ...form, plan: e.target.value })} value={form.plan} className="p-2 border rounded w-64">
            <option value="">플랜 선택</option>
            {plans.map(p => <option key={p.id} value={p.id}>{p.id} - {p.vcpu_count}vCPU / {p.ram}MB</option>)}
          </select>

          <select name="os_id" onChange={(e) => setForm({ ...form, os_id: e.target.value })} value={form.os_id} className="p-2 border rounded w-48">
            <option value="">OS 선택</option>
            {oses.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>

          <input
            type="text"
            name="label"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
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
                {isAdmin && <th className="p-2 border">삭제</th>}
              </tr>
            </thead>
            <tbody>
              {instances.map((ins) => (
                <tr key={ins.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{ins.label}</td>
                  <td className="p-2 border">{ins.main_ip}</td>
                  <td className="p-2 border">{ins.region}</td>
                  <td className="p-2 border">{ins.os}</td>
                  <td className="p-2 border">{ins.status}</td>
                  {isAdmin && (
                    <td className="p-2 border">
                      <button
                        onClick={() => deleteInstance(ins.id)}
                        className="text-red-600 hover:underline"
                      >
                        삭제
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}