import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

export async function saveInstanceToFirestore(userEmail: string, instance: any) {
  const userRef = db.collection('users').doc(userEmail);
  const instancesRef = userRef.collection('servers');
  await instancesRef.doc(instance.id).set(instance);
}

export { db };
