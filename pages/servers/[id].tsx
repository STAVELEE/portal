import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function ServerDetail() {
  const router = useRouter()
  const { id } = router.query

  const [server, setServer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    const fetchServer = async () => {
      try {
        const res = await fetch(`/api/vultr/instance?id=${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || '정보 조회 실패')
        setServer(data.instance)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchServer()
  }, [id])

  if (loading) return <p className="p-4">⏳ 서버 정보 불러오는 중...</p>
  if (error) return <p className="p-4 text-red-500">❌ {error}</p>
  if (!server) return <p className="p-4">❌ 서버 정보를 찾을 수 없습니다.</p>

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">🖥️ 서버 상세 정보</h1>

        <table className="w-full text-sm border">
          <tbody>
            <tr><td className="font-semibold p-2 border w-1/3">ID</td><td className="p-2 border">{server.id}</td></tr>
            <tr><td className="font-semibold p-2 border">이름</td><td className="p-2 border">{server.label}</td></tr>
            <tr><td className="font-semibold p-2 border">IP</td><td className="p-2 border">{server.main_ip || '할당 중'}</td></tr>
            <tr><td className="font-semibold p-2 border">지역</td><td className="p-2 border">{server.region}</td></tr>
            <tr><td className="font-semibold p-2 border">OS</td><td className="p-2 border">{server.os}</td></tr>
            <tr><td className="font-semibold p-2 border">상태</td><td className="p-2 border">{server.status}</td></tr>
            <tr><td className="font-semibold p-2 border">CPU</td><td className="p-2 border">{server.vcpu_count} vCPU</td></tr>
            <tr><td className="font-semibold p-2 border">RAM</td><td className="p-2 border">{server.ram} MB</td></tr>
            <tr><td className="font-semibold p-2 border">디스크</td><td className="p-2 border">{server.disk}</td></tr>
            <tr><td className="font-semibold p-2 border">생성일</td><td className="p-2 border">{server.date_created}</td></tr>
            <tr><td className="font-semibold p-2 border">루트 비밀번호</td><td className="p-2 border">{server.default_password || '확인 불가'}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
