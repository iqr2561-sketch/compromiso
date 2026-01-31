import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import newsHandler from './api/news.js';
import pharmaciesHandler from './api/pharmacies.js';
import categoriesHandler from './api/categories.js';
import galleryHandler from './api/gallery.js';
import adsHandler from './api/ads.js';
import settingsHandler from './api/settings.js';
import commentsHandler from './api/comments.js';
import cronIncrementHandler from './api/cron-increment.js';
import cityHeroHandler from './api/city-hero.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080; // Default to 8080 for Cloud Run

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Adapter function to convert Vercel-style handlers to Express middleware
const adapt = (handler) => {
    return async (req, res) => {
        try {
            await handler(req, res);
        } catch (error) {
            console.error(`API Error in ${req.path}:`, error);
            res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    };
};

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

// API Routes
app.all('/api/news', adapt(newsHandler));
app.all('/api/pharmacies', adapt(pharmaciesHandler));
app.all('/api/categories', adapt(categoriesHandler));
app.all('/api/gallery', adapt(galleryHandler));
app.all('/api/ads', adapt(adsHandler));
app.all('/api/settings', adapt(settingsHandler));
app.all('/api/comments', adapt(commentsHandler));
app.all('/api/cron-increment', adapt(cronIncrementHandler));
app.all('/api/city-hero', adapt(cityHeroHandler));

// Serve static files from the React app build
const distPath = path.join(__dirname, 'dist');
console.log(`Serving static files from: ${distPath}`);

app.use(express.static(distPath));

// Handle React routing, return all requests to React app
app.get(/^(.*)$/, (req, res) => {
    // If it's an API call that wasn't caught above, it's a 404
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    // Otherwise serve the index.html
    const indexPath = path.join(distPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error(`Error sending index.html from ${indexPath}:`, err);
            res.status(404).send('Application not built or index.html missing');
        }
    });
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is listening on port ${PORT}`);
    console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Time: ${new Date().toISOString()}`);
});

// Handle termination signals
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

