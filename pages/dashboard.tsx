// pages/dashboard.tsx
import { useEffect, useState } from 'react'
import useAdmin from '../lib/useAdmin'

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [instances, setInstances] = useState<any[]>([])
  const isAdmin = useAdmin()

  useEffect(() => {
    setMounted(true)

    const load = async () => {
      const res = await fetch('/api/vultr/instances')
      const data = await res.json()
      setInstances(data.instances || [])
    }
    load()
  }, [])

  const deleteInstance = async (id: string) => {
    if (!confirm('정말 삭제할까요?')) return
    await fetch(`/api/vultr/delete?id=${id}`, { method: 'DELETE' })
    const updated = await fetch('/api/vultr/instances').then(res => res.json())
    setInstances(updated.instances || [])
  }

  if (!mounted) return null
  if (!isAdmin) return <p className="p-6 text-red-500">⛔ 관리자 전용 페이지입니다.</p>

  const getTier = (count: number) => {
    if (count === 0) return 'Free'
    if (count <= 3) return 'Basic'
    if (count <= 10) return 'Pro'
    return 'Enterprise'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 서버 통계 대시보드</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">총 서버 수</h2>
            <p className="text-2xl font-bold text-blue-600">{instances.length}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">요금제 등급</h2>
            <p className="text-2xl font-bold text-green-600">{getTier(instances.length)}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">🕒 최근 서버 목록</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">라벨</th>
                  <th className="p-2 border">IP</th>
                  <th className="p-2 border">리전</th>
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
                    <td className="p-2 border">{ins.status}</td>
                    {isAdmin && (
                    <td className="p-2 border">
                      <button onClick={() => deleteInstance(ins.id)} className="text-red-600 hover:underline">삭제</button>
                    </td>
                  )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
