import db from './api/lib/firestore.js';

async function testFirestore() {
  console.log('🚀 Probando conexión a Firestore...');
  try {
    const collections = await db.listCollections();
    console.log('✅ Conexión exitosa a Firestore.');
    console.log('📋 Colecciones disponibles:');
    collections.forEach(col => console.log(`   - ${col.id}`));
  } catch (error) {
    console.error('❌ Error de conexión a Firestore:', error);
  } finally {
    process.exit();
  }
}

testFirestore();