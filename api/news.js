import pool from './lib/db.js';

export default async function handler(req, res) {
    const { method } = req;

    try {
        const client = await pool.connect();

        switch (method) {
            case 'GET': {
                const { all } = req.query;
                let rows = [];
                try {
                    let query = "SELECT * FROM news WHERE (status = 'published' OR status IS NULL OR (status = 'scheduled' AND scheduled_at <= CURRENT_TIMESTAMP)) ORDER BY date DESC, created_at DESC";
                    if (all === 'true') {
                        query = 'SELECT * FROM news ORDER BY date DESC, created_at DESC';
                    }
                    const result = await client.query(query);
                    rows = result.rows;
                } catch (e) {
                    console.error("Advanced query failed, falling back to simple query:", e.message);
                    const result = await client.query('SELECT * FROM news ORDER BY date DESC, created_at DESC');
                    rows = result.rows;
                }

                // Map database naming (snake_case) to frontend (camelCase)
                const mappedRows = rows.map(row => ({
                    ...row,
                    isHero: !!row.is_hero,
                    isFlash: !!row.is_flash,
                    timeRead: row.time_read || '2 min'
                }));
                res.status(200).json(mappedRows);
                break;
            }

            case 'POST': {
                const { title, content, category, author, date, image, isHero, isFlash, timeRead, status, scheduledAt } = req.body;
                const insertRes = await client.query(
                    'INSERT INTO news (title, content, category, author, date, image, is_hero, is_flash, time_read, status, scheduled_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
                    [title, content, category, author, date, image, isHero || false, isFlash || false, timeRead, status || 'published', scheduledAt]
                );
                res.status(201).json({
                    ...insertRes.rows[0],
                    isHero: insertRes.rows[0].is_hero,
                    isFlash: insertRes.rows[0].is_flash,
                    timeRead: insertRes.rows[0].time_read,
                    scheduledAt: insertRes.rows[0].scheduled_at
                });
                break;
            }

            case 'PUT': {
                const { id, title, content, category, author, date, image, isHero, isFlash, timeRead, status, scheduledAt } = req.body;

                const mappedUpdateData = {
                    title,
                    content,
                    category,
                    author,
                    date,
                    image,
                    is_hero: isHero,
                    is_flash: isFlash,
                    time_read: timeRead,
                    status,
                    scheduled_at: scheduledAt
                };

                // Filter out undefined fields so we only update what's provided
                const filteredKeys = Object.keys(mappedUpdateData).filter(key => mappedUpdateData[key] !== undefined);
                const fields = filteredKeys.map((key, i) => `${key} = $${i + 2}`).join(', ');
                const values = filteredKeys.map(key => mappedUpdateData[key]);

                if (fields.length === 0) {
                    res.status(400).json({ error: 'No fields to update' });
                    break;
                }

                const updateRes = await client.query(
                    `UPDATE news SET ${fields} WHERE id = $1 RETURNING *`,
                    [id, ...values]
                );
                res.status(200).json({
                    ...updateRes.rows[0],
                    isHero: updateRes.rows[0].is_hero,
                    isFlash: updateRes.rows[0].is_flash,
                    timeRead: updateRes.rows[0].time_read,
                    scheduledAt: updateRes.rows[0].scheduled_at
                });
                break;
            }

            case 'DELETE':
                const { id: delId } = req.query;
                await client.query('DELETE FROM news WHERE id = $1', [delId]);
                res.status(200).json({ message: 'Deleted successfully' });
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
