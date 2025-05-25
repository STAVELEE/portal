// pages/profile.tsx
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Link from 'next/link';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function ProfilePage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const { data, error } = useSWR('/api/vultr/instances', fetcher);

  if (!session) return <p className="p-6">로그인이 필요합니다.</p>;
  if (error) return <p className="p-6">에러 발생: {error.message}</p>;
  if (!data) return <p className="p-6">로딩 중...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">내 서버 목록</h1>
      <ul>
        {data.instances.map((inst: any) => (
          <li key={inst.id} className="mb-2">
            <Link href={`/servers/${inst.id}`} className="text-blue-600 underline">
              {inst.label} - {inst.main_ip}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}