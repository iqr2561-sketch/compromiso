import db, { formatFirestoreData } from './lib/firestore.js';

export default async function handler(req, res) {
    const { method } = req;
    const commentsCol = db.collection('comments');

    try {
        switch (method) {
            case 'GET': {
                const { status } = req.query;
                let query = commentsCol.orderBy('createdAt', 'desc');

                if (status) {
                    query = query.where('status', '==', status);
                }

                const snapshot = await query.get();
                const comments = snapshot.docs.map(doc => formatFirestoreData(doc));

                // Note: Normally we'd join with news title here, but for now we return the raw comments
                res.status(200).json(comments);
                break;
            }

            case 'POST': {
                const { post_id, name, email, comment } = req.body;
                const newComment = {
                    post_id,
                    name,
                    email,
                    comment,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                };
                const docRef = await commentsCol.add(newComment);
                res.status(201).json({ id: docRef.id, ...newComment });
                break;
            }

            case 'PUT': {
                const { id, status } = req.body;
                if (!id) return res.status(400).json({ error: 'ID required' });

                await commentsCol.doc(id).update({ status, updatedAt: new Date().toISOString() });
                const updatedDoc = await commentsCol.doc(id).get();
                res.status(200).json(formatFirestoreData(updatedDoc));
                break;
            }

            case 'DELETE': {
                const { id } = req.query;
                if (!id) return res.status(400).json({ error: 'ID required' });
                await commentsCol.doc(id).delete();
                res.status(200).json({ message: 'Comment deleted' });
                break;
            }

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Comments API Firestore Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

