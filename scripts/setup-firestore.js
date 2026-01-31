import db from '../api/lib/firestore.js';

async function setupProject() {
    console.log('🚀 Iniciando configuración de Firestore...');

    try {
        // 1. Configurar Administrador por defecto
        console.log('👥 Configurando administradores...');
        const adminsCol = db.collection('admins');
        const adminSnapshot = await adminsCol.where('username', '==', 'redaccion').get();

        if (adminSnapshot.empty) {
            await adminsCol.add({
                username: 'redaccion',
                password: 'admin', // Cambiar después de entrar
                name: 'Redacción Compromiso',
                recovery_code: 'COMPROMISO-2026',
                created_at: new Date().toISOString()
            });
            console.log('✅ Administrador "redaccion" creado (pass: admin)');
        } else {
            console.log('ℹ️ El administrador ya existe.');
        }

        // 2. Configurar Ajustes iniciales
        console.log('⚙️ Configurando ajustes de edición...');
        const settingsCol = db.collection('settings');
        const defaultSettings = [
            { id: 'edition_number', value: '42891' },
            { id: 'cover_page_date', value: new Date().toISOString().split('T')[0] },
            { id: 'edition_auto_increment', value: 'true' },
            { id: 'ai_enabled', value: 'false' }
        ];

        for (const setting of defaultSettings) {
            const doc = await settingsCol.doc(setting.id).get();
            if (!doc.exists) {
                await settingsCol.doc(setting.id).set({
                    value: setting.value,
                    updatedAt: new Date().toISOString()
                });
                console.log(`✅ Ajuste "${setting.id}" inicializado.`);
            }
        }

        // 3. Configurar Categorías básicas
        console.log('📁 Configurando categorías...');
        const catCol = db.collection('categories');
        const initialCats = [
            { name: "Locales", color: "#256af4", position: 1 },
            { name: "Sociedad", color: "#ff6b00", position: 2 },
            { name: "Deportes", color: "#00d68f", position: 3 },
            { name: "Policiales", color: "#f4256a", position: 4 },
            { name: "Provinciales", color: "#9333ea", position: 5 }
        ];

        for (const cat of initialCats) {
            const snap = await catCol.where('name', '==', cat.name).get();
            if (snap.empty) {
                await catCol.add({
                    ...cat,
                    createdAt: new Date().toISOString()
                });
                console.log(`✅ Categoría "${cat.name}" creada.`);
            }
        }

        console.log('\n✨ Configuración completada con éxito.');
        console.log('Ya puedes acceder al panel de administración.');

    } catch (error) {
        console.error('❌ Error durante la configuración:', error);
    } finally {
        process.exit();
    }
}

setupProject();
