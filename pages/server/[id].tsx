// pages/server/[id].tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function ServerDetail() {
  const { query } = useRouter()
  const [data, setData] = useState<any>(null)
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!query.id) return
    fetch(`/api/vultr/instance?id=${query.id}`)
      .then(res => res.json())
      .then(setData)

    const storedPass = sessionStorage.getItem(`server-password-${query.id}`)
    setPassword(storedPass || '비밀번호 정보 없음')
  }, [query.id])

  if (!data) return <p className="p-4">로딩 중...</p>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🖥️ 서버 상세 정보</h1>
      <pre className="bg-gray-100 p-4 rounded mb-4 overflow-x-auto text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">🔑 비밀번호</h2>
        <p className="font-mono">{password}</p>
      </div>
    </div>
  )
}
