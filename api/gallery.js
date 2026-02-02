import db, { formatFirestoreData } from './lib/firestore.js';
import { uploadImage } from './lib/storage.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id, type } = req.query;
    const galleryCol = db.collection('gallery');
    const cityHeroCol = db.collection('city_hero_images');

    try {
        if (type === 'city-hero') {
            switch (method) {
                case 'GET': {
                    const snapshot = await cityHeroCol.orderBy('createdAt', 'desc').get();
                    const images = snapshot.docs.map(doc => formatFirestoreData(doc));
                    res.status(200).json(images);
                    return;
                }
                case 'POST': {
                    const { url: cityUrl } = req.body;
                    if (!cityUrl) return res.status(400).json({ error: 'URL is required' });

                    const finalUrl = await uploadImage(cityUrl, 'city-hero');

                    const newCityImg = { url: finalUrl, createdAt: new Date().toISOString() };
                    const docRef = await cityHeroCol.add(newCityImg);
                    res.status(201).json({ id: docRef.id, ...newCityImg });
                    return;
                }
                case 'DELETE': {
                    if (!id) return res.status(400).json({ error: 'ID is required' });
                    await cityHeroCol.doc(id).delete();
                    res.status(200).json({ success: true });
                    return;
                }
                default:
                    res.status(405).end();
                    return;
            }
        }

        // Default: Standard Gallery
        switch (method) {
            case 'GET': {
                const { limit, offset, search } = req.query;
                const pageLimit = parseInt(limit) || 20;
                const pageOffset = parseInt(offset) || 0;

                let query = galleryCol.orderBy('createdAt', 'desc');

                // For search, we need to get all and filter (Firestore doesn't support LIKE)
                if (search) {
                    const allSnapshot = await query.get();
                    const allImages = allSnapshot.docs.map(doc => formatFirestoreData(doc));

                    // Filter by filename (case-insensitive)
                    const searchLower = search.toLowerCase();
                    const filtered = allImages.filter(img =>
                        (img.filename && img.filename.toLowerCase().includes(searchLower)) ||
                        (img.alt_text && img.alt_text.toLowerCase().includes(searchLower)) ||
                        (img.url && img.url.toLowerCase().includes(searchLower))
                    );

                    // Paginate the filtered results
                    const paginated = filtered.slice(pageOffset, pageOffset + pageLimit);

                    res.status(200).json({
                        images: paginated,
                        total: filtered.length,
                        hasMore: (pageOffset + pageLimit) < filtered.length
                    });
                } else {
                    // Get total count for pagination info
                    const countSnapshot = await galleryCol.count().get();
                    const total = countSnapshot.data().count;

                    // Apply pagination
                    const snapshot = await query.limit(pageLimit).offset(pageOffset).get();
                    const images = snapshot.docs.map(doc => formatFirestoreData(doc));

                    res.status(200).json({
                        images: images,
                        total: total,
                        hasMore: (pageOffset + pageLimit) < total
                    });
                }
                break;
            }
            case 'POST': {
                const { url, filename, alt_text } = req.body;
                if (!url) return res.status(400).json({ error: 'URL is required' });

                const finalGalleryUrl = await uploadImage(url, 'gallery');

                const newGalleryImg = {
                    url: finalGalleryUrl,
                    filename: filename || null,
                    alt_text: alt_text || null,
                    createdAt: new Date().toISOString()
                };
                const docRef = await galleryCol.add(newGalleryImg);
                res.status(201).json({ id: docRef.id, ...newGalleryImg });
                break;
            }
            case 'DELETE': {
                if (!id) return res.status(400).json({ error: 'ID is required' });
                await galleryCol.doc(id).delete();
                res.status(200).json({ message: 'Image deleted successfully' });
                break;
            }
            default:
                res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
                res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Gallery API Firestore Error:', error);
        res.status(500).json({ error: error.message });
    }
}

