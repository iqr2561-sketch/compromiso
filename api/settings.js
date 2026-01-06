import pool from './lib/db.js';

export default async function handler(req, res) {
    const { method } = req;

    try {
        const client = await pool.connect();

        switch (method) {
            case 'GET':
                const { rows } = await client.query('SELECT * FROM settings');
                const settings = rows.reduce((acc, current) => {
                    acc[current.key] = current.value;
                    return acc;
                }, {});
                res.status(200).json(settings);
                break;

            case 'POST':
                const { key, value } = req.body;
                await client.query(
                    'INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()',
                    [key, value.toString()]
                );
                res.status(200).json({ success: true, key, value });
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }

        client.release();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
