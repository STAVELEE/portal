// lib/firestore.ts
import { db } from './firebaseAdmin'; // Import the admin db

export async function saveInstanceToFirestore(userEmail: string, instance: any) {
  // Note: The admin 'db' object already has collection, doc, etc. methods.
  // The original code for collection and doc might need adjustment if it was assuming
  // a client-side db structure, but given it's using 'firebase-admin/firestore'
  // it should be mostly compatible. Let's assume the methods are available.
  const userRef = db.collection('users').doc(userEmail);
  const instancesRef = userRef.collection('servers');
  await instancesRef.doc(instance.id).set(instance);
}

// Optionally, re-export the admin db if other server-side files were importing it from here
// export { db }; 
// However, it's better practice for them to import directly from './firebaseAdmin'
// For now, let's remove the export of db from this file to avoid confusion,
// as pages/index.tsx was incorrectly importing a db from here (or lib/firebase.ts).
