import pg from 'pg';

const { Pool } = pg;

// Permitir certificados autofirmados en desarrollo para evitar errores de conexión
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Configuración optimizada para Supabase
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export default pool;
