import pool from './lib/db.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    try {
        const client = await pool.connect();

        const { type } = req.query;

        switch (method) {
            case 'GET':
                const { rows } = await client.query('SELECT * FROM categories ORDER BY position ASC, id ASC');
                res.status(200).json(rows);
                break;

            case 'POST':
                if (type === 'reorder') {
                    const { items } = req.body;
                    for (const item of items) {
                        await client.query('UPDATE categories SET position = $1 WHERE id = $2', [item.position, item.id]);
                    }
                    return res.status(200).json({ success: true });
                }
                const { name, color, bg_image, parent_id } = req.body;
                const insertRes = await client.query(
                    'INSERT INTO categories (name, color, bg_image, parent_id) VALUES ($1, $2, $3, $4) RETURNING *',
                    [name, color, bg_image, parent_id || null]
                );
                res.status(201).json(insertRes.rows[0]);
                break;

            case 'PUT':
                const { name: upName, color: upColor, bg_image: upBg, parent_id: upParent } = req.body;
                const updateRes = await client.query(
                    'UPDATE categories SET name = $1, color = $2, bg_image = $3, parent_id = $4 WHERE id = $5 RETURNING *',
                    [upName, upColor, upBg, upParent || null, id || req.body.id]
                );
                res.status(200).json(updateRes.rows[0]);
                break;

            case 'DELETE':
                await client.query('DELETE FROM categories WHERE id = $1', [id]);
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
