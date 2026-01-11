import pg from 'pg';

const { Pool } = pg;

// Configuración optimizada para Supabase
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export default pool;
