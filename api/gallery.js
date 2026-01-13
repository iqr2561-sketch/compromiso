import pool from './lib/db.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id, type } = req.query;

    try {
        const client = await pool.connect();

        try {
            if (type === 'city-hero') {
                switch (method) {
                    case 'GET':
                        const { rows: cityRows } = await client.query('SELECT * FROM city_hero_images ORDER BY created_at DESC');
                        return res.status(200).json(cityRows);
                    case 'POST':
                        const { url: cityUrl } = req.body;
                        if (!cityUrl) return res.status(400).json({ error: 'URL is required' });
                        const cityInsert = await client.query('INSERT INTO city_hero_images (url) VALUES ($1) RETURNING *', [cityUrl]);
                        return res.status(201).json(cityInsert.rows[0]);
                    case 'DELETE':
                        if (!id) return res.status(400).json({ error: 'ID is required' });
                        await client.query('DELETE FROM city_hero_images WHERE id = $1', [id]);
                        return res.status(200).json({ success: true });
                    default:
                        return res.status(405).end();
                }
            }

            // Default: Standard Gallery
            switch (method) {
                case 'GET':
                    const { rows } = await client.query('SELECT * FROM gallery ORDER BY created_at DESC');
                    return res.status(200).json(rows);
                case 'POST':
                    const { url, filename, alt_text } = req.body;
                    if (!url) return res.status(400).json({ error: 'URL is required' });
                    const { rows: postRows } = await client.query(
                        'INSERT INTO gallery (url, filename, alt_text) VALUES ($1, $2, $3) RETURNING *',
                        [url, filename || null, alt_text || null]
                    );
                    return res.status(201).json(postRows[0]);
                case 'DELETE':
                    if (!id) return res.status(400).json({ error: 'ID is required' });
                    await client.query('DELETE FROM gallery WHERE id = $1', [id]);
                    return res.status(200).json({ message: 'Image deleted successfully' });
                default:
                    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
                    return res.status(405).json({ error: 'Method not allowed' });
            }
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Gallery API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
