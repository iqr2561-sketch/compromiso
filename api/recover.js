import pool from './lib/db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, recoveryCode, newPassword } = req.body;

    if (!username || !recoveryCode || !newPassword) {
        return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
    }

    try {
        // Verificar código de recuperación
        const result = await pool.query(
            'SELECT id FROM admins WHERE username = $1 AND recovery_code = $2',
            [username, recoveryCode]
        );

        if (result.rows.length > 0) {
            // Código correcto, resetear contraseña y desbloquear
            await pool.query(
                'UPDATE admins SET password = $1, failed_attempts = 0, locked_until = NULL WHERE id = $2',
                [newPassword, result.rows[0].id]
            );

            return res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
        } else {
            return res.status(401).json({ success: false, message: 'Código de recuperación o usuario incorrecto' });
        }
    } catch (error) {
        console.error('Recovery error:', error);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
}
