import db, { formatFirestoreData } from './lib/firestore.js';
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
    const { id } = req.query;
    const adsCol = db.collection('ads');

    try {
        switch (method) {
            case 'GET': {
                const snapshot = await adsCol.orderBy('position', 'asc').get();
                const ads = snapshot.docs.map(doc => formatFirestoreData(doc));
                res.status(200).json(ads);
                break;
            }

            case 'POST': {
                const { type: qType } = req.query;
                if (qType === 'reorder') {
                    const { items } = req.body;
                    const batch = db.batch();
                    items.forEach(item => {
                        const docRef = adsCol.doc(item.id);
                        batch.update(docRef, { position: item.position });
                    });
                    await batch.commit();
                    return res.status(200).json({ success: true });
                }

                const { type, title, content, sub_content, image, link, button, active } = req.body;
                if (!type) return res.status(400).json({ error: 'Type is required' });

                // Upload image if base64
                const imageUrl = await uploadImage(image, 'ads');

                const newAd = {
                    type,
                    title: title || '',
                    content: content || '',
                    sub_content: sub_content || '',
                    image: imageUrl || '',
                    link: link || '',
                    button: button || '',
                    active: active !== false,
                    position: 0, // default
                    createdAt: new Date().toISOString()
                };

                const docRef = await adsCol.add(newAd);
                res.status(201).json({ id: docRef.id, ...newAd });
                break;
            }

            case 'PUT': {
                const { type, title, content, sub_content, image, link, button, active } = req.body;

                // Upload image if base64
                const imageUrl = await uploadImage(image, 'ads');

                const upId = id || req.body.id;
                if (!upId) return res.status(400).json({ error: 'ID required' });

                const updateData = {
                    type,
                    title: title || '',
                    content: content || '',
                    sub_content: sub_content || '',
                    image: image || '',
                    link: link || '',
                    button: button || '',
                    active: active !== false,
                    updatedAt: new Date().toISOString()
                };

                await adsCol.doc(upId).update(updateData);
                const updatedDoc = await adsCol.doc(upId).get();
                res.status(200).json(formatFirestoreData(updatedDoc));
                break;
            }

            case 'DELETE': {
                if (!id) return res.status(400).json({ error: 'ID required' });
                await adsCol.doc(id).delete();
                res.status(200).json({ success: true });
                break;
            }

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Ads API Firestore Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

