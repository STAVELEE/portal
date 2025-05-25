import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Invalid server ID' });

  const docRef = db.collection('servers').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) return res.status(404).json({ error: 'Server not found' });

  const data = docSnap.data();
  if (!data) return res.status(500).json({ error: 'Data parsing error' }); // ✅ 추가

  if (data.ownerId !== session.id) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  res.status(200).json(data);
}
