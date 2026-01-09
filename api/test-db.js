import pool from './lib/db.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as time, current_database() as db');
        client.release();

        return res.status(200).json({
            success: true,
            message: 'Conexión exitosa a la base de datos',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Database connection test failed:', error);
        return res.status(500).json({
            success: false,
            message: 'Error de conexión a la base de datos',
            error: error.message
        });
    }
}
