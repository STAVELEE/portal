import { db } from './firebaseAdmin';

export const saveInstanceToFirestore = async (userId: string, instanceData: any) => {
  const userRef = db.collection('users').doc(userId);
  const instancesRef = userRef.collection('instances');
  await instancesRef.add({
    ...instanceData,
    createdAt: new Date(),
  });
};
