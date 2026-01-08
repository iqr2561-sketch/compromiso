import pg from 'pg';
const { Pool } = pg;

// Using the same config as api/lib/db.js but with explicit URL from my records
const pool = new Pool({
    connectionString: 'postgres://neondb_owner:npg_oREsYyv1D9hp@ep-bold-glade-a5tq35n5-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkColumns() {
    try {
        const client = await pool.connect();
        const res = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'news'
        `);
        console.log('Columns in news table:');
        console.log(res.rows.map(r => r.column_name).join(', '));

        const resCount = await client.query('SELECT COUNT(*) FROM news');
        console.log('Total news count:', resCount.rows[0].count);

        client.release();
        await pool.end();
    } catch (err) {
        console.error('Error:', err.message);
        await pool.end();
    }
}

checkColumns();
