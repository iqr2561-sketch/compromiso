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
    status TEXT DEFAULT 'published',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    time_read TEXT DEFAULT '2 min',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ads (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT,
    content TEXT,
    sub_content TEXT,
    image TEXT,
    link TEXT,
    button TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES news(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    comment TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

CREATE TABLE IF NOT EXISTS tickers (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    tag TEXT,
    type TEXT DEFAULT 'alert',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT 'primary',
    bg_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    filename TEXT,
    alt_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pharmacies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    city TEXT DEFAULT 'Central',
    lat DECIMAL(10, 8) DEFAULT 0,
    lng DECIMAL(11, 8) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pharmacy_duty (
    id SERIAL PRIMARY KEY,
    pharmacy_id INTEGER REFERENCES pharmacies(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date)
);

INSERT INTO settings (key, value) VALUES 
('edition_number', '1'),
('cover_page_date', CURRENT_DATE::text),
('footer_description', 'Periodismo moderno para la generación digital.'),
('footer_column_2_title', 'Propiedad Intelectual'),
('footer_column_4_title', 'AFIP - Data Fiscal'),
('footer_copyright', '© 2026 Diario Digital Inc.'),
('ai_enabled', 'false'),
('ai_model', 'gemini-1.5-flash')
ON CONFLICT (key) DO NOTHING;

INSERT INTO categories (name, color) VALUES 
('Locales', 'primary'),
('Deportes', 'accent-pink'),
('Actualidad', 'accent-green'),
('Cultura', 'accent-purple')
ON CONFLICT (name) DO NOTHING;
