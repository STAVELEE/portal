import { getFirestore } from 'firebase-admin/firestore'
import { getApps, initializeApp, cert } from 'firebase-admin/app'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  })
}

export const db = getFirestore()
