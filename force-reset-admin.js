import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

async function resetAdmin() {
    console.log('🔄 Iniciando reseteo forzado de credenciales...');

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
    }

    const db = getFirestore('compromiso');

    try {
        const adminsCol = db.collection('admins');

        // 1. Buscar si ya existe el usuario 'redaccion'
        const snapshot = await adminsCol.where('username', '==', 'redaccion').get();

        const adminData = {
            username: 'redaccion',
            password: 'admin', // Contraseña temporal
            name: 'Redacción Compromiso',
            recovery_code: 'COMPROMISO-2026',
            failed_attempts: 0,
            locked_until: null,
            updated_at: new Date().toISOString()
        };

        if (snapshot.empty) {
            console.log('➕ Creando nuevo usuario administrador...');
            await adminsCol.add({
                ...adminData,
                created_at: new Date().toISOString()
            });
        } else {
            console.log('🛠️ Actualizando usuario administrador existente...');
            const docId = snapshot.docs[0].id;
            await adminsCol.doc(docId).update(adminData);
        }

        console.log('✅ Credenciales reseteadas con éxito.');
        console.log('-----------------------------------');
        console.log('Usuario: redaccion');
        console.log('Password: admin');
        console.log('-----------------------------------');

    } catch (error) {
        console.error('❌ Error durante el reseteo:', error);
    } finally {
        process.exit();
    }
}

resetAdmin();
