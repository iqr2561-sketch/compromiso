import express from 'express';
import newsHandler from './api/news.js';
import pharmaciesHandler from './api/pharmacies.js';
import categoriesHandler from './api/categories.js';
import galleryHandler from './api/gallery.js';
import adsHandler from './api/ads.js';
import settingsHandler from './api/settings.js';
import commentsHandler from './api/comments.js';
import cronIncrementHandler from './api/cron-increment.js';
import cityHeroHandler from './api/city-hero.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ... (omitted adapt function)

// Mount API routes
app.all('/api/news', adapt(newsHandler));
app.all('/api/pharmacies', adapt(pharmaciesHandler));
app.all('/api/categories', adapt(categoriesHandler));
app.all('/api/gallery', adapt(galleryHandler));
app.all('/api/ads', adapt(adsHandler));
app.all('/api/settings', adapt(settingsHandler));
app.all('/api/comments', adapt(commentsHandler));
app.all('/api/cron-increment', adapt(cronIncrementHandler));
app.all('/api/city-hero', adapt(cityHeroHandler));

app.listen(PORT, () => {
    console.log(`✅ Local API Server running on http://localhost:${PORT}`);
    console.log(`   (Proxied by Vite from /api)`);
});
