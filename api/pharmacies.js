import pool from './lib/db.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id, type } = req.query;

    try {
        const client = await pool.connect();

        try {
            // Handle Duties
            if (type === 'duty') {
                if (method === 'GET') {
                    const { rows } = await client.query('SELECT pd.date, pd.pharmacy_id as "pharmacyId" FROM pharmacy_duty pd ORDER BY pd.date ASC');
                    return res.status(200).json(rows.map(r => ({
                        ...r,
                        date: new Date(r.date).toISOString().split('T')[0]
                    })));
                }
                if (method === 'POST') {
                    const { date, pharmacyId } = req.body;
                    if (!date) return res.status(400).json({ error: 'Date is required' });

                    if (pharmacyId === null) {
                        await client.query('DELETE FROM pharmacy_duty WHERE date = $1', [date]);
                    } else {
                        await client.query(`
                            INSERT INTO pharmacy_duty (date, pharmacy_id) VALUES ($1, $2)
                            ON CONFLICT (date) DO UPDATE SET pharmacy_id = EXCLUDED.pharmacy_id, created_at = NOW()
                        `, [date, pharmacyId]);
                    }
                    return res.status(200).json({ success: true, date, pharmacyId });
                }
            }

            // Handle Pharmacies
            switch (method) {
                case 'GET':
                    const { rows } = await client.query('SELECT * FROM pharmacies ORDER BY name ASC');
                    res.status(200).json(rows);
                    break;

                case 'POST':
                    const { name, address, phone, city, lat, lng } = req.body;
                    const insertRes = await client.query(
                        'INSERT INTO pharmacies (name, address, phone, city, lat, lng) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                        [name, address, phone, city || 'Central', lat || 0, lng || 0]
                    );
                    res.status(201).json(insertRes.rows[0]);
                    break;

                case 'PUT':
                    const { name: upName, address: upAddress, phone: upPhone, city: upCity, lat: upLat, lng: upLng } = req.body;
                    const targetId = id || req.body.id;
                    const updateRes = await client.query(
                        'UPDATE pharmacies SET name = $1, address = $2, phone = $3, city = $4, lat = $5, lng = $6 WHERE id = $7 RETURNING *',
                        [upName, upAddress, upPhone, upCity, upLat || 0, upLng || 0, targetId]
                    );
                    res.status(200).json(updateRes.rows[0]);
                    break;

                case 'DELETE':
                    await client.query('DELETE FROM pharmacies WHERE id = $1', [id]);
                    res.status(200).json({ success: true });
                    break;

                default:
                    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                    res.status(405).end(`Method ${method} Not Allowed`);
            }
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Pharmacies API Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
