import pool from './lib/db.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    try {
        switch (method) {
            case 'GET':
                const users = await pool.query('SELECT id, username, name, created_at, failed_attempts, locked_until FROM admins ORDER BY id ASC');
                return res.status(200).json(users.rows);

            case 'POST':
                const { username, password, name, recovery_code } = req.body;
                const newUser = await pool.query(
                    'INSERT INTO admins (username, password, name, recovery_code) VALUES ($1, $2, $3, $4) RETURNING id, username, name',
                    [username, password, name, recovery_code || 'COMPROMISO-2026']
                );
                return res.status(201).json(newUser.rows[0]);

            case 'PUT':
                const { username: upUsername, password: upPassword, name: upName, recovery_code: upRecovery } = req.body;
                let query = 'UPDATE admins SET username = $1, name = $2';
                let params = [upUsername, upName, id];

                if (upPassword) {
                    query += ', password = $4';
                    params.push(upPassword);
                }
                if (upRecovery) {
                    query += ', recovery_code = $' + (params.length + 1);
                    params.push(upRecovery);
                }

                query += ' WHERE id = $3 RETURNING id, username, name';

                const updatedUser = await pool.query(query, params);
                return res.status(200).json(updatedUser.rows[0]);

            case 'DELETE':
                // Evitar que se borre a sí mismo o que se borre el último admin (opcional, pero recomendado)
                const count = await pool.query('SELECT COUNT(*) FROM admins');
                if (parseInt(count.rows[0].count) <= 1) {
                    return res.status(400).json({ message: 'No se puede eliminar el último administrador' });
                }
                await pool.query('DELETE FROM admins WHERE id = $1', [id]);
                return res.status(200).json({ success: true });

            default:
                return res.status(405).end();
        }
    } catch (error) {
        console.error('Admins API Error:', error);
        return res.status(500).json({ message: error.message });
    }
}
