import { db } from './firebase'

export async function saveInstanceToFirestore(userEmail: string, instance: any) {
  const userRef = db.collection('users').doc(userEmail)
  const instancesRef = userRef.collection('servers')
  await instancesRef.doc(instance.id).set(instance)
}
