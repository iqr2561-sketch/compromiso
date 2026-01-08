import pg from 'pg';
// We assume DATABASE_URL is in the environment or we could try to read it
// Since I can't read .env, I'll try to use process.env.DATABASE_URL
// If it's empty, it will fail, which is fine for a quick check.

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkAds() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT id, type, title, length(image) as image_len, created_at FROM ads ORDER BY created_at DESC LIMIT 10');
        console.log('Last 10 ads:');
        result.rows.forEach(row => {
            console.log(`ID: ${row.id}, Type: ${row.type}, Title: ${row.title}, ImgLen: ${row.image_len}, Date: ${row.created_at}`);
        });
        client.release();
    } catch (err) {
        console.error('DB Error:', err);
    } finally {
        pool.end();
    }
}

checkAds();
