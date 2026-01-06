import { sql } from './lib/db.js';

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
        // GET - Fetch all gallery images
        if (req.method === 'GET') {
            const result = await sql`SELECT * FROM gallery ORDER BY created_at DESC`;
            return res.status(200).json(result);
        }

        // POST - Add new image to gallery
        if (req.method === 'POST') {
            const { url, filename, alt_text } = req.body;

            if (!url) {
                return res.status(400).json({ error: 'URL is required' });
            }

            const result = await sql`
                INSERT INTO gallery (url, filename, alt_text)
                VALUES (${url}, ${filename || null}, ${alt_text || null})
                RETURNING *
            `;

            return res.status(201).json(result[0]);
        }

        // DELETE - Remove image from gallery
        if (req.method === 'DELETE') {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ error: 'ID is required' });
            }

            await sql`DELETE FROM gallery WHERE id = ${id}`;
            return res.status(200).json({ message: 'Image deleted successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Gallery API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
