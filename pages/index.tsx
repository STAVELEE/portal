import { useState } from 'react'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const createServer = async () => {
    setLoading(true)
    setResult(null)

    const res = await fetch('/api/server/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        region: 'ams',          // 암스테르담
        plan: 'vc2-1c-1gb',     // 1vCPU, 1GB RAM
        os_id: '215',           // Ubuntu 22.04 x64
        label: 'demo-server'
      })
    })

    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Vultr Server Creator</h1>
      <button onClick={createServer} disabled={loading}>
        {loading ? '생성 중...' : '서버 생성하기'}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>생성 결과:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
