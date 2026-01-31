import db from './lib/firestore.js';
import { uploadImage } from './lib/storage.js';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
};

export default async function handler(req, res) {
    const { method } = req;
    const settingsCol = db.collection('settings');

    try {
        const { test } = req.query;

        // DB Connection Test
        if (test === 'true') {
            // In Firestore we just try to get any collection to verify connectivity
            await settingsCol.limit(1).get();
            return res.status(200).json({
                success: true,
                message: 'Conexión exitosa con Firestore',
                data: {
                    time: new Date().toISOString(),
                    project: db.projectId || 'Unknown',
                    env: process.env.NODE_ENV || 'development'
                }
            });
        }

        switch (method) {
            case 'GET': {
                const snapshot = await settingsCol.get();
                const settings = {};
                snapshot.docs.forEach(doc => {
                    settings[doc.id] = doc.data().value;
                });
                res.status(200).json(settings);
                break;
            }

            case 'POST': {
                const { key, value } = req.body;
                if (!key) return res.status(400).json({ error: 'Key required' });

                let finalValue = value;

                // If it's an image key and has base64 data, upload to storage
                if (key.includes('image') || key.includes('logo') || key.includes('bg')) {
                    finalValue = await uploadImage(value, 'settings');
                }

                await settingsCol.doc(key).set({
                    value: finalValue !== undefined ? finalValue.toString() : '',
                    updatedAt: new Date().toISOString()
                });
                res.status(200).json({ success: true, key, value: finalValue });
                break;
            }

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Settings API Firestore Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

