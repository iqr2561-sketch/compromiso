import admin from 'firebase-admin';

async function checkDatabase() {
    console.log('🔍 Verificando base de datos "compromiso"...');

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            databaseId: 'compromiso'
        });
    }

    const db = admin.firestore();

    try {
        const collections = await db.listCollections();
        console.log('✅ Conexión establecida.');
        console.log('📋 Colecciones encontradas:');
        collections.forEach(c => console.log(`  - ${c.id}`));

        const adminSnap = await db.collection('admins').get();
        console.log(`👥 Documentos en "admins": ${adminSnap.size}`);
        adminSnap.forEach(doc => {
            console.log(`  - User: ${doc.data().username}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        process.exit();
    }
}

checkDatabase();
