import pool from './lib/db.js';

export default async function handler(req, res) {
    const { method } = req;

    try {
        const client = await pool.connect();

        switch (method) {
            case 'GET':
                const { rows } = await client.query('SELECT * FROM news ORDER BY created_at DESC');
                // Map database naming (snake_case) to frontend (camelCase)
                const mappedRows = rows.map(row => ({
                    ...row,
                    isHero: row.is_hero,
                    isFlash: row.is_flash,
                    timeRead: row.time_read
                }));
                res.status(200).json(mappedRows);
                break;

            case 'POST':
                const { title, content, category, author, date, image, isHero, isFlash, timeRead } = req.body;
                const insertRes = await client.query(
                    'INSERT INTO news (title, content, category, author, date, image, is_hero, is_flash, time_read) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
                    [title, content, category, author, date, image, isHero || false, isFlash || false, timeRead]
                );
                res.status(201).json({
                    ...insertRes.rows[0],
                    isHero: insertRes.rows[0].is_hero,
                    isFlash: insertRes.rows[0].is_flash,
                    timeRead: insertRes.rows[0].time_read
                });
                break;

            case 'PUT':
                const { id, isHero: isHeroUpdate, isFlash: isFlashUpdate, timeRead: timeReadUpdate, ...updateData } = req.body;
                const mappedUpdateData = {
                    ...updateData,
                    is_hero: isHeroUpdate,
                    is_flash: isFlashUpdate,
                    time_read: timeReadUpdate
                };

                const fields = Object.keys(mappedUpdateData).filter(key => mappedUpdateData[key] !== undefined).map((key, i) => `${key} = $${i + 2}`).join(', ');
                const values = Object.values(mappedUpdateData).filter(val => val !== undefined);

                const updateRes = await client.query(
                    `UPDATE news SET ${fields} WHERE id = $1 RETURNING *`,
                    [id, ...values]
                );
                res.status(200).json({
                    ...updateRes.rows[0],
                    isHero: updateRes.rows[0].is_hero,
                    isFlash: updateRes.rows[0].is_flash,
                    timeRead: updateRes.rows[0].time_read
                });
                break;

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
