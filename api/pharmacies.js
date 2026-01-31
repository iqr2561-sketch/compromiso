import db, { formatFirestoreData } from './lib/firestore.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id, type } = req.query;
    const pharmCol = db.collection('pharmacies');
    const dutyCol = db.collection('pharmacy_duty');

    try {
        // Handle Duties
        if (type === 'duty') {
            if (method === 'GET') {
                const snapshot = await dutyCol.orderBy('date', 'asc').get();
                const duties = snapshot.docs.map(doc => formatFirestoreData(doc));
                res.status(200).json(duties);
                return;
            }
            if (method === 'POST') {
                const { date, pharmacyId } = req.body;
                if (!date) return res.status(400).json({ error: 'Date is required' });

                if (pharmacyId === null) {
                    // Delete duty for this date if it exists
                    const snapshot = await dutyCol.where('date', '==', date).get();
                    const batch = db.batch();
                    snapshot.docs.forEach(doc => batch.delete(doc.ref));
                    await batch.commit();
                } else {
                    // Upsert: Firestore uses doc ID or logic
                    // We can use the date as the ID if it's unique per date
                    await dutyCol.doc(date).set({ date, pharmacyId, createdAt: new Date().toISOString() });
                }
                res.status(200).json({ success: true, date, pharmacyId });
                return;
            }
        }

        // Handle Reorder
        if (type === 'reorder') {
            if (method === 'POST') {
                const { items } = req.body;
                const batch = db.batch();
                items.forEach(item => {
                    batch.update(pharmCol.doc(item.id), { position: item.position });
                });
                await batch.commit();
                res.status(200).json({ success: true });
                return;
            }
        }

        // Handle Pharmacies
        switch (method) {
            case 'GET': {
                const snapshot = await pharmCol.orderBy('position', 'asc').get();
                const pharmacies = snapshot.docs.map(doc => formatFirestoreData(doc));
                res.status(200).json(pharmacies);
                break;
            }

            case 'POST': {
                const { name, address, phone, city, lat, lng, position } = req.body;
                const newPharm = {
                    name,
                    address: address || '',
                    phone: phone || '',
                    city: city || 'Central',
                    location: { lat: lat || 0, lng: lng || 0 }, // optional structure change or keep flat
                    lat: lat || 0,
                    lng: lng || 0,
                    position: position || 0,
                    createdAt: new Date().toISOString()
                };
                const docRef = await pharmCol.add(newPharm);
                res.status(201).json({ id: docRef.id, ...newPharm });
                break;
            }

            case 'PUT': {
                const { name: upName, address: upAddress, phone: upPhone, city: upCity, lat: upLat, lng: upLng } = req.body;
                const targetId = id || req.body.id;
                if (!targetId) return res.status(400).json({ error: 'ID required' });

                const updateData = {
                    name: upName,
                    address: upAddress,
                    phone: upPhone,
                    city: upCity,
                    lat: upLat || 0,
                    lng: upLng || 0,
                    updatedAt: new Date().toISOString()
                };

                await pharmCol.doc(targetId).update(updateData);
                const updatedDoc = await pharmCol.doc(targetId).get();
                res.status(200).json(formatFirestoreData(updatedDoc));
                break;
            }

            case 'DELETE': {
                if (!id) return res.status(400).json({ error: 'ID required' });
                await pharmCol.doc(id).delete();
                res.status(200).json({ success: true });
                break;
            }

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Pharmacies API Firestore Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

