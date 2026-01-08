import pool from './lib/db.js';

export default async function handler(req, res) {
    try {
        const client = await pool.connect();
        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);

        const adsColumns = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'ads'
        `);

        const adsCount = await client.query('SELECT COUNT(*) FROM ads');
        const adsSample = await client.query('SELECT * FROM ads LIMIT 5');

        client.release();
        res.status(200).json({
            tables: tables.rows.map(t => t.table_name),
            adsColumns: adsColumns.rows,
            adsCount: adsCount.rows[0].count,
            adsSample: adsSample.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message, stack: error.stack });
    }
}
