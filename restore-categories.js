import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function restore() {
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT count(*) FROM categories');
        const count = parseInt(rows[0].count);

        if (count === 0) {
            console.log('Categories table is empty. Restoring defaults...');
            await client.query(`
                INSERT INTO categories (name, color, bg_image, position) VALUES 
                ('Policiales', '#ff0000', 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=800', 0),
                ('Política', '#0000ff', 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800', 1),
                ('Deportes', '#00ff00', 'https://images.unsplash.com/photo-1461896704190-3213c9798099?auto=format&fit=crop&q=80&w=800', 2),
                ('Sociedad', '#ffff00', 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800', 3),
                ('Cultura', '#ff00ff', 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&q=80&w=800', 4)
            `);
            console.log('Restoration complete.');
        } else {
            console.log(`Categories table already has ${count} items. No restoration needed.`);
        }
    } finally {
        client.release();
        await pool.end();
    }
}

restore().catch(console.error);
