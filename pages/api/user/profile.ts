// pages/api/user/profile.ts
import type { NextApiRequest, NextApiResponse } from 'next';

let users: any[] = []; // 💾 메모리 DB (실제로는 DB 사용)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, name, phone, birthday } = req.body;

  if (!email || !name || !phone || !birthday)
    return res.status(400).json({ error: '모든 필드를 입력해주세요.' });

  users = users.filter(u => u.email !== email); // 중복 제거
  users.push({ email, name, phone, birthday });

  console.log('✅ 사용자 저장:', users);
  return res.status(200).json({ ok: true });
}
