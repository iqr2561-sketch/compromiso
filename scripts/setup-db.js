import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from root
dotenv.config({ path: join(__dirname, '..', '.env') });

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function setupDatabase() {
    try {
        console.log('🔌 Connecting to Neon Database...');
        const client = await pool.connect();
        console.log('✅ Connected successfully.');

        console.log('🏗️ Creating tables...');

        // News Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        category TEXT NOT NULL,
        author TEXT,
        date TEXT,
        image TEXT,
        is_hero BOOLEAN DEFAULT FALSE,
        is_flash BOOLEAN DEFAULT FALSE,
        time_read TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Ads Table (Optional for now, but good to have)
        await client.query(`
        CREATE TABLE IF NOT EXISTS ads (
          id SERIAL PRIMARY KEY,
          type TEXT NOT NULL,
          title TEXT,
          content TEXT,
          sub_content TEXT,
          image TEXT,
          link TEXT,
          button TEXT,
          active BOOLEAN DEFAULT TRUE
        );
      `);

        console.log('✅ Tables created successfully.');

        // Seed Data Check
        const { rows } = await client.query('SELECT COUNT(*) FROM news');
        if (parseInt(rows[0].count) === 0) {
            console.log('🌱 Seeding initial data...');
            // Insert some dummy data matching current context defaults to avoid empty page
            const initialNews = [
                {
                    title: "Inauguración del Nuevo Centro Cultural en Dolores",
                    content: "Con una inversión millonaria y la presencia de autoridades...",
                    category: "Locales",
                    date: "05 Ene 2026",
                    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1600",
                    is_hero: true
                },
                {
                    title: "Avances en la Digitalización Rural",
                    content: "El programa provincial llega a las zonas más alejadas...",
                    category: "Provinciales",
                    date: "05 Ene 2026",
                    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
                    is_hero: true
                }
            ];

            for (const news of initialNews) {
                await client.query(`
                INSERT INTO news (title, content, category, date, image, is_hero)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [news.title, news.content, news.category, news.date, news.image, news.is_hero]);
            }
            console.log('✅ Initial seed data inserted.');
        } else {
            console.log('ℹ️ Tables already have data. Skipping seed.');
        }

        client.release();
    } catch (err) {
        console.error('❌ Error creating database tables:', err);
    } finally {
        await pool.end();
    }
}

setupDatabase();
