import pool from './lib/db.js';

export default async function handler(req, res) {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'news'
        `);
        client.release();
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
