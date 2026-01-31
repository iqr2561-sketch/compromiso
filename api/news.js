import db, { formatFirestoreData } from './lib/firestore.js';
import { uploadImage } from './lib/storage.js';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default async function handler(req, res) {
    const { method } = req;
    const newsCol = db.collection('news');

    try {
        switch (method) {
            case 'GET': {
                const { all } = req.query;
                let query = newsCol.orderBy('date', 'desc');

                if (all !== 'true') {
                    // Simple filter: in Firestore we usually use status
                    // complex combined queries might need indexes, but let's start simple
                    query = query.where('status', 'in', ['published', null]);
                }

                const snapshot = await query.get();
                const news = snapshot.docs.map(doc => {
                    const data = formatFirestoreData(doc);
                    return {
                        ...data,
                        isHero: !!data.isHero,
                        isFlash: !!data.isFlash,
                        timeRead: data.timeRead || '2 min'
                    };
                });

                res.status(200).json(news);
                break;
            }

            case 'POST': {
                const { title, content, category, author, date, image, isHero, isFlash, timeRead, status, scheduledAt } = req.body;

                // Handle Image Upload if it's base64
                const imageUrl = await uploadImage(image, 'news');

                const newDoc = {
                    title,
                    content: content || '',
                    category: category || 'General',
                    author: author || 'Redacción',
                    date: date || new Date().toISOString().split('T')[0],
                    image: imageUrl || '',
                    isHero: !!isHero,
                    isFlash: !!isFlash,
                    timeRead: timeRead || '2 min',
                    status: status || 'published',
                    scheduledAt: scheduledAt || null,
                    createdAt: new Date().toISOString()
                };

                const docRef = await newsCol.add(newDoc);
                res.status(201).json({ id: docRef.id, ...newDoc });
                break;
            }

            case 'PUT': {
                const { id, ...updateData } = req.body;
                if (!id) return res.status(400).json({ error: 'ID required' });

                const docRef = newsCol.doc(id);

                // Handle Image Upload in PUT if it's base64
                if (updateData.image) {
                    updateData.image = await uploadImage(updateData.image, 'news');
                }

                // Remove undefined values to avoid Firestore errors
                Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

                await docRef.update({
                    ...updateData,
                    updatedAt: new Date().toISOString()
                });

                const updatedDoc = await docRef.get();
                res.status(200).json(formatFirestoreData(updatedDoc));
                break;
            }

            case 'DELETE': {
                const { id: delId } = req.query;
                if (!delId) return res.status(400).json({ error: 'ID required' });

                await newsCol.doc(delId).delete();
                res.status(200).json({ message: 'Deleted successfully' });
                break;
            }

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }

    } catch (error) {
        console.error('News API Firestore Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

