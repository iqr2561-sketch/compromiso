import pool from './lib/db.js';

export default async function handler(req, res) {
    // Optional: Add secret token check if called from Vercel Cron
    // if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return res.status(401).end('Unauthorized');
    // }

    try {
        const client = await pool.connect();

        // Get current settings
        const { rows } = await client.query("SELECT key, value FROM settings WHERE key IN ('edition_number', 'last_increment_date')");
        const settings = rows.reduce((acc, current) => {
            acc[current.key] = current.value;
            return acc;
        }, {});

        const today = new Date().toISOString().split('T')[0];

        if (settings.last_increment_date !== today) {
            const currentNumber = parseInt(settings.edition_number || '42891');
            const newNumber = currentNumber + 1;

            await client.query("UPDATE settings SET value = $1, updated_at = NOW() WHERE key = 'edition_number'", [newNumber.toString()]);
            await client.query("UPDATE settings SET value = $1, updated_at = NOW() WHERE key = 'cover_page_date'", [today]);
            await client.query("UPDATE settings SET value = $1, updated_at = NOW() WHERE key = 'last_increment_date'", [today]);

            client.release();
            return res.status(200).json({ success: true, message: `Edition incremented to ${newNumber}`, newNumber });
        }

        client.release();
        res.status(200).json({ success: true, message: 'Already incremented today', currentNumber: settings.edition_number });
    } catch (error) {
        console.error('Cron error:', error);
        res.status(500).json({ error: error.message });
    }
}
