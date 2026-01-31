import db from './api/lib/firestore.js';

async function listAdmins() {
    console.log('🔍 Buscando administradores en Firestore...');
    try {
        const adminsCol = db.collection('admins');
        const snapshot = await adminsCol.get();

        if (snapshot.empty) {
            console.log('❌ No hay administradores registrados.');
            return;
        }

        console.log('👥 Administradores encontrados:');
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`- Usuario: ${data.username}`);
            console.log(`  Password: ${data.password}`);
            console.log(`  Nombre: ${data.name || 'N/A'}`);
            console.log(`  Código Recuperación: ${data.recovery_code || 'N/A'}`);
            console.log('---------------------------');
        });
    } catch (error) {
        console.error('❌ Error al consultar admins:', error);
    } finally {
        process.exit();
    }
}

listAdmins();
