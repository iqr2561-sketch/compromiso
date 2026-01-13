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

async function updateSecurity() {
    try {
        console.log('🔌 Connecting to Database...');
        const client = await pool.connect();

        console.log('🏗️ Updating admins table with security columns...');
        await client.query(`
      ALTER TABLE admins 
      ADD COLUMN IF NOT EXISTS failed_attempts INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS recovery_code TEXT DEFAULT 'COMPROMISO-2026';
    `);

        console.log('✅ Security update complete.');
        client.release();
    } catch (err) {
        console.error('❌ Error updating security:', err);
    } finally {
        await pool.end();
    }
}

updateSecurity();
