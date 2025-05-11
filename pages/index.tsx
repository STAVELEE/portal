import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function ServerList() {
  const { data: session, status } = useSession()
  const [instances, setInstances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status !== 'authenticated') return

    const fetchServers = async () => {
      const snapshot = await getDocs(collection(db, 'users', session?.user?.email!, 'servers'))
      const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setInstances(result)
      setLoading(false)
    }

    fetchServers()
  }, [status])

  if (status === 'unauthenticated') return <p>로그인이 필요합니다.</p>
  if (loading) return <p>로딩 중...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🖥️ 내 서버</h1>
      <table className="table-auto border">
        <thead>
          <tr>
            <th>이름</th><th>IP</th><th>리전</th><th>OS</th><th>상태</th>
          </tr>
        </thead>
        <tbody>
          {instances.map(ins => (
            <tr key={ins.id} onClick={() => router.push(`/servers/${ins.id}`)} className="cursor-pointer">
              <td>{ins.label}</td><td>{ins.main_ip}</td><td>{ins.region}</td><td>{ins.os}</td><td>{ins.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
