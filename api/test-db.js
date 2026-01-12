import pg from 'pg';

const { Pool } = pg;

export default async function handler(req, res) {
    const dbUrl = process.env.DATABASE_URL;
    const hasDbUrl = !!dbUrl;

    // Debug info
    const debugInfo = {
        hasDbUrl,
        urlPrefix: hasDbUrl ? dbUrl.substring(0, 15) + '...' : 'N/A',
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    };

    if (!hasDbUrl) {
        return res.status(500).json({
            success: false,
            message: 'DATABASE_URL environment variable is missing',
            debug: debugInfo
        });
    }

    const pool = new Pool({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as time, current_database() as db');
        client.release();
        await pool.end();

        return res.status(200).json({
            success: true,
            message: 'Connection Successful',
            data: result.rows[0],
            debug: debugInfo
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Connection Failed',
            error: error.message,
            debug: debugInfo
        });
    }
}
