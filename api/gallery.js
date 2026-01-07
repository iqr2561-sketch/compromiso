import pool from './lib/db.js';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const client = await pool.connect();

        try {
            // GET - Fetch all gallery images
            if (req.method === 'GET') {
                const { rows } = await client.query('SELECT * FROM gallery ORDER BY created_at DESC');
                res.status(200).json(rows);
                return;
            }

            // POST - Add new image to gallery
            if (req.method === 'POST') {
                const { url, filename, alt_text } = req.body;

                if (!url) {
                    res.status(400).json({ error: 'URL is required' });
                    return;
                }

                const { rows } = await client.query(
                    'INSERT INTO gallery (url, filename, alt_text) VALUES ($1, $2, $3) RETURNING *',
                    [url, filename || null, alt_text || null]
                );

                res.status(201).json(rows[0]);
                return;
            }

            // DELETE - Remove image from gallery
            if (req.method === 'DELETE') {
                const { id } = req.query;

                if (!id) {
                    res.status(400).json({ error: 'ID is required' });
                    return;
                }

                await client.query('DELETE FROM gallery WHERE id = $1', [id]);
                res.status(200).json({ message: 'Image deleted successfully' });
                return;
            }

            res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
            res.status(405).json({ error: 'Method not allowed' });

        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Gallery API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
