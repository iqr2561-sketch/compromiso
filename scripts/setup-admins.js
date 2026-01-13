import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function setupAdmins() {
    try {
        console.log('🔌 Connecting to Database...');
        const client = await pool.connect();

        console.log('🏗️ Creating admins table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

        console.log('🌱 Inserting default admin...');
        await client.query(`
      INSERT INTO admins (username, password, name) 
      VALUES ('redaccion', 'Fede1234', 'Redacción Compromiso')
      ON CONFLICT (username) DO NOTHING;
    `);

        console.log('✅ Admin setup complete.');
        client.release();
    } catch (err) {
        console.error('❌ Error setting up admins:', err);
    } finally {
        await pool.end();
    }
}

setupAdmins();
