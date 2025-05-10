import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function ProfileForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    birthday: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, email: session?.user?.email }),
    });

    if (res.ok) router.push('/');
    else alert('정보 저장 실패');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h1 className="text-lg font-semibold mb-4">👤 사용자 정보 입력</h1>
        <input type="text" name="name" onChange={handleChange} placeholder="이름" className="mb-2 p-2 w-full border rounded" />
        <input type="text" name="phone" onChange={handleChange} placeholder="전화번호" className="mb-2 p-2 w-full border rounded" />
        <input type="date" name="birthday" onChange={handleChange} placeholder="생년월일" className="mb-4 p-2 w-full border rounded" />
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          저장
        </button>
      </div>
    </div>
  );
}
