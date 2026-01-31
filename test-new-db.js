import db from './api/lib/firestore.js';

async function test() {
    console.log('Testing connection...');
    try {
        const snapshot = await db.collection('admins').get();
        console.log(`Success! Found ${snapshot.size} admins.`);
        snapshot.forEach(doc => console.log(` - ${doc.data().username}`));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}

test();
