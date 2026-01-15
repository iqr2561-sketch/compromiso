import pool from './lib/db.js';

export default async function handler(req, res) {
    // Optional: Add secret token check if called from Vercel Cron
    // if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return res.status(401).end('Unauthorized');
    // }

    try {
        const client = await pool.connect();

        // Get current settings including auto-increment and manual override flags
        const { rows } = await client.query(
            "SELECT key, value FROM settings WHERE key IN ('edition_number', 'last_increment_date', 'edition_auto_increment', 'edition_manual_override')"
        );
        const settings = rows.reduce((acc, current) => {
            acc[current.key] = current.value;
            return acc;
        }, {});

        // Check if auto-increment is disabled
        const autoIncrement = settings.edition_auto_increment !== 'false'; // Default true
        const manualOverride = settings.edition_manual_override;

        const today = new Date().toISOString().split('T')[0];

        // If manual override is set and auto-increment is disabled, use the manual number
        if (!autoIncrement && manualOverride) {
            client.release();
            return res.status(200).json({ 
                success: true, 
                message: 'Manual edition mode active', 
                currentNumber: manualOverride,
                mode: 'manual'
            });
        }

        // Auto-increment mode: only increment once per day
        if (autoIncrement && settings.last_increment_date !== today) {
            const currentNumber = parseInt(settings.edition_number || '42891');
            const newNumber = currentNumber + 1;

            await client.query("UPDATE settings SET value = $1, updated_at = NOW() WHERE key = 'edition_number'", [newNumber.toString()]);
            await client.query("UPDATE settings SET value = $1, updated_at = NOW() WHERE key = 'cover_page_date'", [today]);
            await client.query("UPDATE settings SET value = $1, updated_at = NOW() WHERE key = 'last_increment_date'", [today]);

            client.release();
            return res.status(200).json({ 
                success: true, 
                message: `Edition incremented to ${newNumber}`, 
                newNumber,
                mode: 'auto'
            });
        }

        client.release();
        res.status(200).json({ 
            success: true, 
            message: 'Already incremented today', 
            currentNumber: settings.edition_number,
            mode: 'auto'
        });
    } catch (error) {
        console.error('Cron error:', error);
        res.status(500).json({ error: error.message });
    }
}
