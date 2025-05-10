// lib/firestore.ts
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function saveInstanceToFirestore(userId: string, instance: any) {
  const ref = collection(db, 'users', userId, 'instances');
  await addDoc(ref, {
    id: instance.id,
    label: instance.label,
    region: instance.region,
    os: instance.os,
    main_ip: instance.main_ip,
    status: instance.status,
    created_at: new Date().toISOString(),
  });
}
