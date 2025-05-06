import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

interface Instance {
  id: string
  label: string
  main_ip: string
  region: string
  os: string
  status: string
}

export default function ServerList() {
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        const res = await fetch('/api/vultr/instances')
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || '서버 목록 조회 실패')

        let updated = data.instances || []

        const newLabel = localStorage.getItem('creating_label')
        if (newLabel && !updated.some((i: any) => i.label === newLabel)) {
          updated = [
            {
              id: 'creating-' + Date.now(),
              label: newLabel,
              main_ip: '할당 중',
              region: '',
              os: '',
              status: '세팅 중',
            },
            ...updated,
          ]
        }

        setInstances(updated)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchInstances()
    const interval = setInterval(fetchInstances, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <a href="/servers/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            ➕ 새 서버 생성
          </a>
        </div>

        <h1 className="text-3xl font-bold text-blue-700 mb-6">💻 서버 목록</h1>

        {loading ? (
          <p className="text-gray-600">로딩 중...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <table className="min-w-full text-sm text-left border bg-white rounded shadow">
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
                <tr
                  key={ins.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/servers/${ins.id}`)}
                >
                  <td className="p-2 border">{ins.label}</td>
                  <td className="p-2 border">{ins.main_ip}</td>
                  <td className="p-2 border">{ins.region}</td>
                  <td className="p-2 border">{ins.os}</td>
                  <td className="p-2 border">{ins.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
