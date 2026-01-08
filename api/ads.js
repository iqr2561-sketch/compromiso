import pool from './lib/db.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    try {
        const client = await pool.connect();

        switch (method) {
            case 'GET':
                const { rows } = await client.query('SELECT * FROM ads ORDER BY created_at DESC');
                res.status(200).json(rows);
                break;

            case 'POST': {
                const { type, title, content, image, link, active } = req.body;
                const insertRes = await client.query(
                    'INSERT INTO ads (type, title, content, image, link, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [type, title || '', content || '', image, link, active !== false]
                );
                res.status(201).json(insertRes.rows[0]);
                break;
            }

            case 'PUT': {
                const { type, title, content, image, link, active } = req.body;
                const upId = id || req.body.id;
                const updateRes = await client.query(
                    'UPDATE ads SET type = $1, title = $2, content = $3, image = $4, link = $5, active = $6 WHERE id = $7 RETURNING *',
                    [type, title || '', content || '', image, link, active !== false, upId]
                );
                res.status(200).json(updateRes.rows[0]);
                break;
            }

            case 'DELETE':
                await client.query('DELETE FROM ads WHERE id = $1', [id]);
                res.status(200).json({ success: true });
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }

        client.release();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
