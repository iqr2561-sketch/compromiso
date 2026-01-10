import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuración SSL más permisiva para Supabase
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
        // Ignorar completamente la verificación del certificado
        checkServerIdentity: () => undefined,
    }
});

async function testConnection() {
    try {
        console.log('🔌 Conectando a Supabase...');
        const client = await pool.connect();
        console.log('✅ Conexión exitosa!\n');

        // Listar tablas
        const { rows } = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        console.log('📋 Tablas disponibles:');
        rows.forEach(r => console.log(`   - ${r.table_name}`));

        // Si existe tabla news, mostrar count
        if (rows.some(r => r.table_name === 'news')) {
            const count = await client.query('SELECT COUNT(*) FROM news');
            console.log(`\n📰 Total noticias: ${count.rows[0].count}`);
        }

        client.release();
        await pool.end();
        console.log('\n✅ Todo OK');
    } catch (err) {
        console.error('❌ Error:', err.message);
        console.error('\n💡 Si el error es de certificado SSL:');
        console.log('   1. Verifica que estés usando la Connection String correcta de Supabase');
        console.log('   2. Usa "Transaction" pooling mode, no "Session"');
        console.log('   3. La URL debe terminar en .supabase.co:6543');
        await pool.end();
        process.exit(1);
    }
}

testConnection();
