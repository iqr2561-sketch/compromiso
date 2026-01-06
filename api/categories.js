import pool from './lib/db.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    try {
        const client = await pool.connect();

        switch (method) {
            case 'GET':
                const { rows } = await client.query('SELECT * FROM categories ORDER BY id ASC');
                res.status(200).json(rows);
                break;

            case 'POST':
                const { name, color, bg_image } = req.body;
                const insertRes = await client.query(
                    'INSERT INTO categories (name, color, bg_image) VALUES ($1, $2, $3) RETURNING *',
                    [name, color, bg_image]
                );
                res.status(201).json(insertRes.rows[0]);
                break;

            case 'PUT':
                const { name: upName, color: upColor, bg_image: upBg } = req.body;
                const updateRes = await client.query(
                    'UPDATE categories SET name = $1, color = $2, bg_image = $3 WHERE id = $4 RETURNING *',
                    [upName, upColor, upBg, id || req.body.id]
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
