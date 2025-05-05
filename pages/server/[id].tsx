import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function ServerDetail() {
  const router = useRouter()
  const { id } = router.query

  const [server, setServer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    const fetchServerDetail = async () => {
      try {
        const res = await fetch(`/api/vultr/instance/${id}`)
        if (!res.ok) throw new Error('서버 정보를 불러오는 중 오류 발생')
        const data = await res.json()
        setServer(data.instance)
      } catch (err: any) {
        setError('서버 정보를 불러오는 중 오류 발생')
      } finally {
        setLoading(false)
      }
    }

    fetchServerDetail()
  }, [id])

  if (loading) return <p>⏳ 서버 로딩 중...</p>
  if (error) return <p className="text-red-600">{error}</p>

  if (!server) return <p>❌ 서버 정보를 찾을 수 없습니다.</p>

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">📦 {server.label} 상세 정보</h1>

        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">서버 기본 정보</h2>
          <ul className="space-y-4">
            <li><strong>IP 주소:</strong> {server.main_ip}</li>
            <li><strong>리전:</strong> {server.region}</li>
            <li><strong>OS:</strong> {server.os}</li>
            <li><strong>상태:</strong> {server.status}</li>
            <li><strong>라벨:</strong> {server.label}</li>
            <li><strong>생성 시간:</strong> {new Date(server.date_created).toLocaleString()}</li>
            <li><strong>비밀번호:</strong> {server.default_password}</li>
          </ul>
        </div>

        <h2 className="text-lg font-semibold mb-4">서버 상태</h2>
        <ul className="space-y-4">
          <li><strong>CPU:</strong> {server.vcpu_count} vCPU</li>
          <li><strong>RAM:</strong> {server.ram} MB</li>
          <li><strong>디스크:</strong> {server.disk} GB</li>
          <li><strong>대역폭:</strong> {server.allowed_bandwidth} GB</li>
        </ul>
      </div>
    </div>
  )
}
