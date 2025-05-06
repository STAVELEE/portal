// pages/api/vultr/sshkeys.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.VULTR_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'VULTR_API_KEY 환경변수가 없습니다.' });
  }

  try {
    if (req.method === 'GET') {
      const response = await axios.get('https://api.vultr.com/v2/ssh-keys', {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      return res.status(200).json({ sshkeys: response.data.ssh_keys });
    }

    if (req.method === 'POST') {
      const { name, public_key } = req.body;

      if (!name || !public_key) {
        return res.status(400).json({ error: 'name과 public_key가 필요합니다.' });
      }

      const response = await axios.post(
        'https://api.vultr.com/v2/ssh-keys',
        { name, ssh_key: public_key },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return res.status(200).json({ sshkey: response.data.ssh_key });
    }

    return res.status(405).json({ error: '허용되지 않은 메서드입니다.' });
  } catch (error: any) {
    console.error('🔴 SSH 키 처리 실패:', error.response?.data || error.message);
    return res.status(500).json({ error: 'SSH 키 처리 실패', detail: error.response?.data || error.message });
  }
}
