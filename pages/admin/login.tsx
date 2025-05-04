// pages/admin/login.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'



export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    const data = await res.json()
    if (res.ok) {
      router.push('/')
    } else {
      setError(data.error || '로그인 실패')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">🔐 관리자 로그인</h1>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          placeholder="관리자 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          로그인
        </button>
        {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
      </div>
    </div>
  )
}
