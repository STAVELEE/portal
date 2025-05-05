import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ServerDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [server, setServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!id) return;

    const fetchServerDetails = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(`/api/vultr/instances/${id}`);
        const data = await res.json();

        if (res.ok) {
          setServer(data.instance);
        } else {
          setError(data.error || '서버 정보를 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('서버 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchServerDetails();
  }, [id]);

  if (loading) return <p>⏳ 서버 로딩 중...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!server) return <p>❌ 서버 정보를 찾을 수 없습니다.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">서버 정보: {server.label}</h1>
      <div>
        <p><strong>IP 주소:</strong> {server.main_ip}</p>
        <p><strong>OS:</strong> {server.os}</p>
        <p><strong>상태:</strong> {server.status}</p>
        <p><strong>라벨:</strong> {server.label}</p>
        <p><strong>리전:</strong> {server.region}</p>
        <p><strong>파워 상태:</strong> {server.power_status}</p>
      </div>
    </div>
  );
}
