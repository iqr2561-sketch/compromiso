import db, { formatFirestoreData } from './lib/firestore.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id, action } = req.query;
    const adminsCol = db.collection('admins');

    try {
        if (method === 'POST') {
            const { username, password, recoveryCode, newPassword, name, recovery_code } = req.body;

            // Handle Login
            if (action === 'login') {
                const snapshot = await adminsCol.where('username', '==', username).limit(1).get();
                if (snapshot.empty) {
                    return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
                }

                const doc = snapshot.docs[0];
                const user = { id: doc.id, ...doc.data() };

                if (user.locked_until && new Date(user.locked_until) > new Date()) {
                    const minutesLeft = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
                    return res.status(403).json({
                        success: false,
                        message: `Cuenta bloqueada temporalmente por seguridad. Intenta nuevamente en ${minutesLeft} minutos.`
                    });
                }

                if (user.password === password) {
                    await doc.ref.update({ failed_attempts: 0, locked_until: null });
                    delete user.password;
                    delete user.recovery_code;
                    delete user.failed_attempts;
                    return res.status(200).json({ success: true, user });
                } else {
                    const newAttempts = (user.failed_attempts || 0) + 1;
                    let lockedUntil = null;
                    let message = 'Usuario o contraseña incorrectos';
                    if (newAttempts >= 5) {
                        lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
                        message = 'Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.';
                    }
                    await doc.ref.update({ failed_attempts: newAttempts, locked_until: lockedUntil });
                    return res.status(401).json({ success: false, message, attemptsLeft: Math.max(0, 5 - newAttempts) });
                }
            }

            // Handle Recovery
            if (action === 'recover') {
                if (!username || !recoveryCode || !newPassword) {
                    return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
                }
                const snapshot = await adminsCol.where('username', '==', username).where('recovery_code', '==', recoveryCode).limit(1).get();
                if (!snapshot.empty) {
                    const doc = snapshot.docs[0];
                    await doc.ref.update({ password: newPassword, failed_attempts: 0, locked_until: null });
                    return res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
                } else {
                    return res.status(401).json({ success: false, message: 'Código de recuperación o usuario incorrecto' });
                }
            }

            // Default POST: Create User
            const newUser = {
                username,
                password,
                name: name || '',
                recovery_code: recovery_code || 'COMPROMISO-2026',
                created_at: new Date().toISOString()
            };
            const docRef = await adminsCol.add(newUser);
            const { password: _, ...userSafe } = newUser;
            return res.status(201).json({ id: docRef.id, ...userSafe });
        }

        switch (method) {
            case 'GET': {
                const snapshot = await adminsCol.orderBy('created_at', 'asc').get();
                const users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    delete data.password;
                    return { id: doc.id, ...data };
                });
                return res.status(200).json(users);
            }

            case 'PUT': {
                const { username: upUsername, password: upPassword, name: upName, recovery_code: upRecovery } = req.body;
                const targetId = id || req.body.id;
                if (!targetId) return res.status(400).json({ error: 'ID required' });

                const updateData = {};
                if (upUsername) updateData.username = upUsername;
                if (upName) updateData.name = upName;
                if (upPassword) updateData.password = upPassword;
                if (upRecovery) updateData.recovery_code = upRecovery;
                updateData.updated_at = new Date().toISOString();

                await adminsCol.doc(targetId).update(updateData);
                const doc = await adminsCol.doc(targetId).get();
                const data = doc.data();
                delete data.password;
                return res.status(200).json({ id: doc.id, ...data });
            }

            case 'DELETE': {
                if (!id) return res.status(400).json({ error: 'ID required' });
                const snapshot = await adminsCol.get();
                if (snapshot.size <= 1) {
                    return res.status(400).json({ message: 'No se puede eliminar el último administrador' });
                }
                await adminsCol.doc(id).delete();
                return res.status(200).json({ success: true });
            }

            default:
                return res.status(405).end();
        }
    } catch (error) {
        console.error('Admins API Firestore Error:', error);
        return res.status(500).json({ message: error.message });
    }
}
