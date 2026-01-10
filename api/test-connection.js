import pool from './lib/db.js';

export default async function handler(req, res) {
    try {
        const client = await pool.connect();

        // Verificar conexión
        const versionResult = await client.query('SELECT version()');

        // Contar tablas
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        // Contar noticias
        const newsCount = await client.query('SELECT COUNT(*) FROM news');

        client.release();

        res.status(200).json({
            success: true,
            message: 'Conexión exitosa a Supabase',
            database: {
                version: versionResult.rows[0].version.split(' ')[1],
                tables: tablesResult.rows.map(r => r.table_name),
                newsCount: parseInt(newsCount.rows[0].count)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            hint: 'Verifica que DATABASE_URL esté configurada correctamente en las variables de entorno'
        });
    }
}
