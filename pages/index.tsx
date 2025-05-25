import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Instance {
  id: string;
  label: string;
  main_ip?: string;
  region?: string;
  os?: string;
  status?: string;
}

export default function ServerList() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status;

  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.email) return;

    const fetchUserInstances = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users', session.user.email, 'servers'));
        const result: Instance[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Instance[];

        setInstances(result);
      } catch (err: any) {
        console.error(err);
        setError('서버 목록 조회 실패');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInstances();
  }, [status, session]);

  if (status === 'unauthenticated') return <p className="p-4">로그인이 필요합니다.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-700">🖥️ 내 서버 목록</h1>
          <a href="/servers/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            ➕ 새 서버 생성
          </a>
        </div>

        {loading ? (
          <p className="text-gray-600">로딩 중...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : instances.length === 0 ? (
          <p className="text-gray-500">생성한 서버가 없습니다.</p>
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
                  <td className="p-2 border">{ins.main_ip || '-'}</td>
                  <td className="p-2 border">{ins.region || '-'}</td>
                  <td className="p-2 border">{ins.os || '-'}</td>
                  <td className="p-2 border">{ins.status || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
