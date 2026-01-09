import pool from './api/lib/db.js';

async function checkAds() {
    try {
        const client = await pool.connect();
        const { rows } = await client.query('SELECT id, type, active, image IS NOT NULL as has_image FROM ads');
        console.log('Current Ads in DB:');
        console.table(rows);
        client.release();
    } catch (err) {
        console.error('Error checking ads:', err);
    } finally {
        process.exit();
    }
}

checkAds();
