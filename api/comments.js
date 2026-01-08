import pool from './lib/db.js';

export default async function handler(req, res) {
    const { method } = req;

    try {
        const client = await pool.connect();

        switch (method) {
            case 'GET': {
                const { status } = req.query;
                let query = 'SELECT c.*, n.title as post_title FROM comments c LEFT JOIN news n ON c.post_id = n.id ORDER BY c.created_at DESC';
                let values = [];

                if (status) {
                    query = 'SELECT c.*, n.title as post_title FROM comments c LEFT JOIN news n ON c.post_id = n.id WHERE c.status = $1 ORDER BY c.created_at DESC';
                    values = [status];
                }

                const { rows } = await client.query(query, values);
                res.status(200).json(rows);
                break;
            }

            case 'POST': {
                const { post_id, name, email, comment } = req.body;
                const insertRes = await client.query(
                    'INSERT INTO comments (post_id, name, email, comment) VALUES ($1, $2, $3, $4) RETURNING *',
                    [post_id, name, email, comment]
                );
                res.status(201).json(insertRes.rows[0]);
                break;
            }

            case 'PUT': {
                const { id, status } = req.body;
                const updateRes = await client.query(
                    'UPDATE comments SET status = $2 WHERE id = $1 RETURNING *',
                    [id, status]
                );
                res.status(200).json(updateRes.rows[0]);
                break;
            }

            case 'DELETE': {
                const { id } = req.query;
                await client.query('DELETE FROM comments WHERE id = $1', [id]);
                res.status(200).json({ message: 'Comment deleted' });
                break;
            }

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
