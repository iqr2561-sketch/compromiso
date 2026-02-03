import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
}

const dbId = process.env.FIRESTORE_DB_ID; // Remove default 'compromiso' which might not exist
console.log(`🔥 Initializing Firestore. DB ID: ${dbId || '(default)'}`);
const db = dbId ? getFirestore(dbId) : getFirestore();

// Helper to convert Firestore timestamp to JS Date or ISO string
export const formatFirestoreData = (doc) => {
    const data = doc.data();
    const id = doc.id;

    // Process all fields to handle timestamps
    Object.keys(data).forEach(key => {
        if (data[key] && typeof data[key].toDate === 'function') {
            data[key] = data[key].toDate().toISOString();
        }
    });

    return { id, ...data };
};

export default db;
