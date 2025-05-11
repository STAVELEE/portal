import { getFirestore } from 'firebase-admin/firestore'
import { getApps, initializeApp, cert } from 'firebase-admin/app'

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  })
}

const db = getFirestore()

export async function saveInstanceToFirestore(userEmail: string, instance: any) {
  const userRef = db.collection('users').doc(userEmail)
  const instancesRef = userRef.collection('instances')
  await instancesRef.doc(instance.id).set(instance)
}
