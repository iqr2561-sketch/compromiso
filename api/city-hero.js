import db, { formatFirestoreData } from './lib/firestore.js';
import { uploadImage } from './lib/storage.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;
    const cityHeroCol = db.collection('city_hero_images');

    try {
        switch (method) {
            case 'GET': {
                const snapshot = await cityHeroCol.where('active', '==', true).orderBy('createdAt', 'desc').get();
                const images = snapshot.docs.map(doc => formatFirestoreData(doc));
                res.status(200).json(images);
                return;
            }

            case 'POST': {
                const { url } = req.body;
                if (!url) return res.status(400).json({ error: 'URL is required' });

                const finalUrl = await uploadImage(url, 'city-hero');

                const newCityImg = {
                    url: finalUrl,
                    active: true,
                    createdAt: new Date().toISOString()
                };
                const docRef = await cityHeroCol.add(newCityImg);
                res.status(201).json({ id: docRef.id, ...newCityImg });
                return;
            }

            case 'PUT': {
                if (!id) return res.status(400).json({ error: 'ID is required' });
                const { active } = req.body;

                await cityHeroCol.doc(id).update({
                    active: active !== undefined ? active : true,
                    updatedAt: new Date().toISOString()
                });

                const updatedDoc = await cityHeroCol.doc(id).get();
                if (!updatedDoc.exists) return res.status(404).json({ error: 'Not found' });

                res.status(200).json(formatFirestoreData(updatedDoc));
                return;
            }

            case 'DELETE': {
                if (!id) return res.status(400).json({ error: 'ID is required' });
                await cityHeroCol.doc(id).delete();
                res.status(200).json({ success: true, message: 'City hero image deleted' });
                return;
            }

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('City Hero API Firestore Error:', error);
        res.status(500).json({ error: error.message });
    }
}

