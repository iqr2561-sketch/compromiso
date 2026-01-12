import pool from './lib/db.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    try {
        const client = await pool.connect();

        try {
            switch (method) {
                case 'GET':
                    const { rows } = await client.query('SELECT * FROM city_hero_images ORDER BY created_at DESC');
                    res.status(200).json(rows);
                    break;

                case 'POST':
                    const { url } = req.body;
                    if (!url) return res.status(400).json({ error: 'URL is required' });

                    const insertRes = await client.query(
                        'INSERT INTO city_hero_images (url) VALUES ($1) RETURNING *',
                        [url]
                    );
                    res.status(201).json(insertRes.rows[0]);
                    break;

                case 'DELETE':
                    if (!id) return res.status(400).json({ error: 'ID is required' });
                    await client.query('DELETE FROM city_hero_images WHERE id = $1', [id]);
                    res.status(200).json({ success: true });
                    break;

                default:
                    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
                    res.status(405).end(`Method ${method} Not Allowed`);
            }
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('City Hero API Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
