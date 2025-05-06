// pages/api/vultr/ssh-keys.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.VULTR_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'VULTR_API_KEY not set' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }

  try {
    const response = await axios.get('https://api.vultr.com/v2/ssh-keys', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const keys = response.data.ssh_keys || [];
    res.status(200).json({ keys });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch SSH keys', detail: err.response?.data || err.message });
  }
}
