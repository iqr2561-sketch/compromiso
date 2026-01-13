import pool from './lib/db.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id, action } = req.query;

    try {
        if (method === 'POST') {
            const { username, password, recoveryCode, newPassword, name, recovery_code } = req.body;

            // Handle Login
            if (action === 'login') {
                const userRes = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
                if (userRes.rows.length === 0) {
                    return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
                }

                const user = userRes.rows[0];
                if (user.locked_until && new Date(user.locked_until) > new Date()) {
                    const minutesLeft = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
                    return res.status(403).json({
                        success: false,
                        message: `Cuenta bloqueada temporalmente por seguridad. Intenta nuevamente en ${minutesLeft} minutos.`
                    });
                }

                if (user.password === password) {
                    await pool.query('UPDATE admins SET failed_attempts = 0, locked_until = NULL WHERE id = $1', [user.id]);
                    delete user.password;
                    delete user.recovery_code;
                    delete user.failed_attempts;
                    return res.status(200).json({ success: true, user });
                } else {
                    const newAttempts = (user.failed_attempts || 0) + 1;
                    let lockedUntil = null;
                    let message = 'Usuario o contraseña incorrectos';
                    if (newAttempts >= 5) {
                        lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
                        message = 'Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.';
                    }
                    await pool.query('UPDATE admins SET failed_attempts = $1, locked_until = $2 WHERE id = $3', [newAttempts, lockedUntil, user.id]);
                    return res.status(401).json({ success: false, message, attemptsLeft: Math.max(0, 5 - newAttempts) });
                }
            }

            // Handle Recovery
            if (action === 'recover') {
                if (!username || !recoveryCode || !newPassword) {
                    return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
                }
                const result = await pool.query('SELECT id FROM admins WHERE username = $1 AND recovery_code = $2', [username, recoveryCode]);
                if (result.rows.length > 0) {
                    await pool.query('UPDATE admins SET password = $1, failed_attempts = 0, locked_until = NULL WHERE id = $2', [newPassword, result.rows[0].id]);
                    return res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
                } else {
                    return res.status(401).json({ success: false, message: 'Código de recuperación o usuario incorrecto' });
                }
            }

            // Default POST: Create User
            const newUser = await pool.query(
                'INSERT INTO admins (username, password, name, recovery_code) VALUES ($1, $2, $3, $4) RETURNING id, username, name',
                [username, password, name, recovery_code || 'COMPROMISO-2026']
            );
            return res.status(201).json(newUser.rows[0]);
        }

        switch (method) {
            case 'GET':
                const users = await pool.query('SELECT id, username, name, created_at, failed_attempts, locked_until FROM admins ORDER BY id ASC');
                return res.status(200).json(users.rows);

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
