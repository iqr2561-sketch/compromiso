import pool from './lib/db.js';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
};

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    try {
        const client = await pool.connect();

        switch (method) {
            case 'GET': {
                const { rows } = await client.query('SELECT * FROM ads ORDER BY created_at DESC');
                console.log(`API GET Ads - Found ${rows.length} ads`);
                res.status(200).json(rows);
                break;
            }

            case 'POST': {
                const { type, title, content, sub_content, image, link, button, active } = req.body;
                console.log('API POST Ads - Saving type:', type);
                console.log('API POST Ads - Received data:', { type, title, content, sub_content, image, link, button, active });

                if (!type) {
                    return res.status(400).json({ error: 'Type is required' });
                }

                const insertRes = await client.query(
                    'INSERT INTO ads (type, title, content, sub_content, image, link, button, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                    [type, title || '', content || '', sub_content || '', image || '', link || '', button || '', active !== false]
                );
                console.log('API POST Ads - Inserted ID:', insertRes.rows[0].id);
                res.status(201).json(insertRes.rows[0]);
                break;
            }

            case 'PUT': {
                const { type, title, content, sub_content, image, link, button, active } = req.body;
                const upId = id || req.body.id;
                console.log('API PUT Ads - Updating ID:', upId);
                console.log('API PUT Ads - Received data:', { type, title, content, sub_content, image, link, button, active });
                const updateRes = await client.query(
                    'UPDATE ads SET type = $1, title = $2, content = $3, sub_content = $4, image = $5, link = $6, button = $7, active = $8 WHERE id = $9 RETURNING *',
                    [type, title || '', content || '', sub_content || '', image || '', link || '', button || '', active !== false, upId]
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
        console.error('Database Error in ads.js:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
