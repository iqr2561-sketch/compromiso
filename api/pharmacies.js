import pool from './lib/db.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    try {
        const client = await pool.connect();

        try {
            switch (method) {
                case 'GET':
                    // Obtener todas las farmacias
                    const { rows } = await client.query('SELECT * FROM pharmacies ORDER BY name ASC');
                    res.status(200).json(rows);
                    break;

                case 'POST':
                    // Crear nueva farmacia
                    const { name, address, phone, city, lat, lng } = req.body;
                    const insertRes = await client.query(
                        'INSERT INTO pharmacies (name, address, phone, city, lat, lng) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                        [name, address, phone, city || 'Central', lat || 0, lng || 0]
                    );
                    res.status(201).json(insertRes.rows[0]);
                    break;

                case 'PUT':
                    // Actualizar farmacia
                    const { name: upName, address: upAddress, phone: upPhone, city: upCity, lat: upLat, lng: upLng } = req.body;

                    // Si viene id en body, usarlo, sino query param
                    const targetId = id || req.body.id;

                    const updateRes = await client.query(
                        'UPDATE pharmacies SET name = $1, address = $2, phone = $3, city = $4, lat = $5, lng = $6 WHERE id = $7 RETURNING *',
                        [upName, upAddress, upPhone, upCity, upLat || 0, upLng || 0, targetId]
                    );
                    res.status(200).json(updateRes.rows[0]);
                    break;

                case 'DELETE':
                    // Eliminar farmacia
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
