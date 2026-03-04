import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  admin.initializeApp();
}

const firestoreDatabaseId = process.env.FIRESTORE_DATABASE_ID || 'klatchupdb';
const db = getFirestore(admin.app(), firestoreDatabaseId);
const storage = admin.storage();

export { db, storage };

// Firestore collections initialization
export const initializeCollections = async () => {
  try {
    // Initialize profile collection with index hints if needed
    const profileRef = db.collection('profiles').doc('_metadata');
    await profileRef.set({ initialized: true }, { merge: true });
    console.log('Collections initialized');
  } catch (error) {
    console.error('Error initializing collections:', error);
  }
};
