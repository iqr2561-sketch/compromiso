import pool from './lib/db.js';

export default async function handler(req, res) {
    try {
        const start = Date.now();
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();

        const duration = Date.now() - start;

        res.status(200).json({
            success: true,
            message: '✅ Conexión exitosa a Neon SQL',
            timestamp: result.rows[0].now,
            latency: `${duration}ms`
        });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error de conexión',
            error: error.message
        });
    }
}
