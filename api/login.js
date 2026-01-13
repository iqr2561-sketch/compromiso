import pool from './lib/db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    try {
        // 1. Buscar usuario
        const userRes = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);

        if (userRes.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }

        const user = userRes.rows[0];

        // 2. Verificar si está bloqueado
        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            const minutesLeft = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
            return res.status(403).json({
                success: false,
                message: `Cuenta bloqueada temporalmente por seguridad. Intenta nuevamente en ${minutesLeft} minutos.`
            });
        }

        // 3. Verificar contraseña
        if (user.password === password) {
            // Éxito: Resetear intentos fallidos
            await pool.query('UPDATE admins SET failed_attempts = 0, locked_until = NULL WHERE id = $1', [user.id]);

            // No devolver datos sensibles
            delete user.password;
            delete user.recovery_code;
            delete user.failed_attempts;

            return res.status(200).json({ success: true, user });
        } else {
            // Fallo: Incrementar intentos
            const newAttempts = (user.failed_attempts || 0) + 1;
            let lockedUntil = null;
            let message = 'Usuario o contraseña incorrectos';

            if (newAttempts >= 5) {
                // Bloquear por 15 minutos
                lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
                message = 'Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.';
            }

            await pool.query(
                'UPDATE admins SET failed_attempts = $1, locked_until = $2 WHERE id = $3',
                [newAttempts, lockedUntil, user.id]
            );

            return res.status(401).json({
                success: false,
                message,
                attemptsLeft: Math.max(0, 5 - newAttempts)
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
}
