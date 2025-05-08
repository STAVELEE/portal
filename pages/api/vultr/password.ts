import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { Fields, Files } from 'formidable'
import fs from 'fs/promises'
import path from 'path'
import { decryptWithPrivateKey } from '@/utils/cryptoUtils'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않은 메서드입니다.' })
  }

  const form = new formidable.IncomingForm()

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      console.error('formidable 파싱 오류:', err)
      return res.status(500).json({ error: '파일 파싱 실패' })
    }

    const encrypted = fields.encryptedPassword?.[0]
    const privateKeyFile = files.privateKey?.[0]

    if (!encrypted || !privateKeyFile) {
      return res.status(400).json({ error: '필수 데이터가 누락되었습니다.' })
    }

    const privateKeyPath = privateKeyFile.filepath
    const privateKey = await fs.readFile(privateKeyPath, 'utf-8')
    const decrypted = decryptWithPrivateKey(encrypted, privateKey)

    return res.status(200).json({ password: decrypted })
  })
}
