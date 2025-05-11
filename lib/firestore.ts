import { db } from './firebase'

export async function saveInstanceToFirestore(userEmail: string, instance: any) {
  const userRef = db.collection('users').doc(userEmail)
  const instanceRef = userRef.collection('servers').doc(instance.id)
  await instanceRef.set(instance)
}
