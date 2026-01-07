import express from 'express';
import newsHandler from './api/news.js';
import pharmaciesHandler from './api/pharmacies.js';
import dutiesHandler from './api/pharmacy-duties.js';
import categoriesHandler from './api/categories.js';
import galleryHandler from './api/gallery.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to adapt Vercel/Next.js handler signature (req, res) to Express
const adapt = (handler) => async (req, res) => {
    // Vercel functions might expect req.body, req.query, etc. Express provides these.
    // Ensure method is upper case for consistency
    req.method = req.method.toUpperCase();
    try {
        await handler(req, res);
    } catch (err) {
        console.error('API Error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    }
};

// Mount API routes
app.all('/api/news', adapt(newsHandler));
app.all('/api/pharmacies', adapt(pharmaciesHandler));
app.all('/api/pharmacy-duties', adapt(dutiesHandler));
app.all('/api/categories', adapt(categoriesHandler));
app.all('/api/gallery', adapt(galleryHandler));

app.listen(PORT, () => {
    console.log(`✅ Local API Server running on http://localhost:${PORT}`);
    console.log(`   (Proxied by Vite from /api)`);
});
