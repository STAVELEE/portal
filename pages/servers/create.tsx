import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import filterPlansByRegion from '@/utils/filterPlansByRegion';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function CreateServer() {
  const [regions, setRegions] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [oses, setOses] = useState<any[]>([]);
  const [type, setType] = useState('');
  const [form, setForm] = useState({ region: '', plan: '', os_id: '', label: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const loadInitial = async () => {
      const [r, o] = await Promise.all([
        fetch('/api/vultr/regions').then(res => res.json()),
        fetch('/api/vultr/os').then(res => res.json())
      ]);
      setRegions(r.regions || []);
      setOses(o.os || []);
    };
    loadInitial();
  }, []);

  useEffect(() => {
    if (!type || !form.region) return;
    const fetchPlans = async () => {
      const res = await fetch(`/api/vultr/plans?type=${type}`);
      const data = await res.json();
      setPlans(filterPlansByRegion(data.plans || [], form.region));
    };
    fetchPlans();
  }, [type, form.region]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async () => {
    if (status !== 'authenticated') {
      setError('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    setError('');

    const label = form.label.trim() || `nebulax-server-${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem('creating_label', label);

    const res = await fetch('/api/server/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, label }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data?.error || '서버 생성 실패');
      setLoading(false);
      return;
    }

    // ✅ Firebase에 저장
    try {
      const docRef = doc(db, 'users', session.user.email!, 'servers', data.instance.id);
      await setDoc(docRef, {
        ...data.instance,
        createdBy: session.user.email,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Firebase 저장 실패:', err);
    }

    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">🚀 서버 생성</h1>

        <div className="flex flex-wrap gap-4 mb-4">
          <select name="region" onChange={handleChange} value={form.region} className="p-2 border rounded w-48">
            <option value="">리전 선택</option>
            {regions.map(r => (
              <option key={r.id} value={r.id}>{r.country} - {r.city}</option>
            ))}
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)} className="p-2 border rounded w-64" disabled={!form.region}>
            <option value="">서버 타입 선택</option>
            <option value="vc2">Cloud Compute (vc2)</option>
            <option value="vhf">High Frequency (vhf)</option>
            <option value="vdc">Dedicated (vdc)</option>
            <option value="voc-g">General Purpose (voc-g)</option>
            <option value="voc-c">CPU Optimized (voc-c)</option>
            <option value="voc-m">Memory Optimized (voc-m)</option>
          </select>

          <select name="plan" onChange={handleChange} value={form.plan} className="p-2 border rounded w-64" disabled={!type}>
            <option value="">플랜 선택</option>
            {plans.map(p => (
              <option key={p.id} value={p.id}>{p.id} - {p.vcpu_count}vCPU / {p.ram}MB</option>
            ))}
          </select>

          <select name="os_id" onChange={handleChange} value={form.os_id} className="p-2 border rounded w-48">
            <option value="">OS 선택</option>
            {oses.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>

          <input
            type="text"
            name="label"
            value={form.label}
            onChange={handleChange}
            placeholder="서버 이름"
            className="p-2 border rounded w-48"
          />

          <button onClick={handleCreate} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {loading ? '⏳ 생성 중...' : '생성하기'}
          </button>
        </div>

        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
}
