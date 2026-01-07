import pool from './lib/db.js';

export default async function handler(req, res) {
    const { method } = req;

    try {
        const client = await pool.connect();

        try {
            switch (method) {
                case 'GET':
                    // Obtener turnos desde el inicio del mes actual o todos
                    // JOIN para traer datos básicos de la farmacia también, aunque el frontend ya tiene las farmacias
                    const { rows } = await client.query(`
                        SELECT pd.date, pd.pharmacy_id as "pharmacyId" 
                        FROM pharmacy_duty pd
                        ORDER BY pd.date ASC
                    `);
                    // Formatear date a string YYYY-MM-DD si viene como objeto Date
                    const formattedRows = rows.map(r => ({
                        ...r,
                        date: new Date(r.date).toISOString().split('T')[0]
                    }));
                    res.status(200).json(formattedRows);
                    break;

                case 'POST':
                    const { date, pharmacyId } = req.body;

                    if (!date) {
                        return res.status(400).json({ error: 'Date is required' });
                    }

                    if (pharmacyId === null) {
                        // Borrar turno
                        await client.query('DELETE FROM pharmacy_duty WHERE date = $1', [date]);
                        res.status(200).json({ success: true, message: 'Duty removed' });
                    } else {
                        // Upsert (Insert or Update)
                        // Postgres: ON CONFLICT (date) DO UPDATE
                        await client.query(`
                            INSERT INTO pharmacy_duty (date, pharmacy_id)
                            VALUES ($1, $2)
                            ON CONFLICT (date) 
                            DO UPDATE SET pharmacy_id = EXCLUDED.pharmacy_id, created_at = NOW()
                        `, [date, pharmacyId]);

                        res.status(200).json({ success: true, date, pharmacyId });
                    }
                    break;

                default:
                    res.setHeader('Allow', ['GET', 'POST']);
                    res.status(405).end(`Method ${method} Not Allowed`);
            }
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Pharmacy Duty API Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
