import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// This script is to be run LOCALLY to seed your Firestore
// You need a service account key file (JSON) to run this locally.
// 1. Go to Firebase Console > Project Settings > Service Accounts
// 2. Click "Generate new private key"
// 3. Save it as 'serviceAccountKey.json' in this folder

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ Error: Archivo serviceAccountKey.json no encontrado.');
    console.log('Por favor, descarga tu clave de cuenta de servicio de Firebase y guárdala en api/lib/serviceAccountKey.json');
    process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const seedData = async () => {
    try {
        console.log('🚀 Iniciando carga de datos de prueba...');

        // 1. Categorías
        const categories = [
            { name: 'Política', color: '#256af4', position: 1 },
            { name: 'Economía', color: '#00d68f', position: 2 },
            { name: 'Deportes', color: '#ff6b00', position: 3 },
            { name: 'Cultura', color: '#8b5cf6', position: 4 }
        ];

        console.log('--- Cargando categorías ---');
        for (const cat of categories) {
            await db.collection('categories').add(cat);
            console.log(`✅ Categoría: ${cat.name}`);
        }

        // 2. Settings iniciales
        const settings = [
            { id: 'edition_number', value: '42891' },
            { id: 'edition_auto_increment', value: 'true' },
            { id: 'cover_page_date', value: new Date().toISOString().split('T')[0] }
        ];

        console.log('--- Cargando configuraciones ---');
        for (const set of settings) {
            await db.collection('settings').doc(set.id).set({
                value: set.value,
                updatedAt: new Date().toISOString()
            });
            console.log(`✅ Setting: ${set.id}`);
        }

        // 3. Una noticia de bienvenida
        const welcomeNews = {
            title: '¡Bienvenido a tu nuevo Diario con Firestore!',
            content: '<p>Este es el primer post cargado desde Firestore. El sistema de base de datos ha sido migrado exitosamente.</p>',
            category: 'Política',
            author: 'Sistema',
            date: new Date().toISOString().split('T')[0],
            image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000',
            isHero: true,
            isFlash: false,
            timeRead: '1 min',
            status: 'published',
            createdAt: new Date().toISOString()
        };

        await db.collection('news').add(welcomeNews);
        console.log('✅ Noticia de bienvenida creada');

        console.log('\n✨ ¡Carga completa exitosa!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error cargando datos:', error);
        process.exit(1);
    }
};

seedData();
