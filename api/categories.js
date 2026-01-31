import db, { formatFirestoreData } from './lib/firestore.js';
import { uploadImage } from './lib/storage.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;
    const catCol = db.collection('categories');

    try {
        const { type } = req.query;

        switch (method) {
            case 'GET': {
                const snapshot = await catCol.orderBy('position', 'asc').get();
                const categories = snapshot.docs.map(doc => formatFirestoreData(doc));
                res.status(200).json(categories);
                break;
            }

            case 'POST': {
                if (type === 'reorder') {
                    const { items } = req.body;
                    const batch = db.batch();
                    items.forEach(item => {
                        const docRef = catCol.doc(item.id);
                        batch.update(docRef, { position: item.position });
                    });
                    await batch.commit();
                    res.status(200).json({ success: true });
                    return;
                }
                const { name, color, bg_image, parent_id } = req.body;

                const finalBgImage = await uploadImage(bg_image, 'categories');

                const newCat = {
                    name,
                    color: color || '#256af4',
                    bg_image: finalBgImage || '',
                    parent_id: parent_id || null,
                    position: 0
                };
                const docRef = await catCol.add(newCat);
                res.status(201).json({ id: docRef.id, ...newCat });
                break;
            }

            case 'PUT': {
                const { name: upName, color: upColor, bg_image: upBg, parent_id: upParent } = req.body;

                const finalUpBg = await uploadImage(upBg, 'categories');

                const catId = id || req.body.id;
                if (!catId) return res.status(400).json({ error: 'ID required' });

                const updateData = {
                    name: upName,
                    color: upColor,
                    bg_image: finalUpBg,
                    parent_id: upParent || null
                };

                // Remove undefined
                Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

                await catCol.doc(catId).update(updateData);
                const updatedDoc = await catCol.doc(catId).get();
                res.status(200).json(formatFirestoreData(updatedDoc));
                break;
            }

            case 'DELETE': {
                if (!id) return res.status(400).json({ error: 'ID required' });
                await catCol.doc(id).delete();
                res.status(200).json({ success: true });
                break;
            }

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Categories API Firestore Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

