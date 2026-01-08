-- =====================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS - DIARIO COMPROMISO
-- versión unificada v1.0
-- =====================================================

-- 1. NOTICIAS (News)
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
    status TEXT DEFAULT 'published', -- 'published', 'scheduled'
    scheduled_at TIMESTAMP WITH TIME ZONE,
    time_read TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PUBLICIDAD (Ads)
CREATE TABLE IF NOT EXISTS ads (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL, -- 'premium', 'square', 'horizontal', 'hero_1', 'hero_2', 'hero_3'
    title TEXT,
    content TEXT,
    sub_content TEXT,
    image TEXT,
    link TEXT,
    button TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. COMENTARIOS (Comments)
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES news(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    comment TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para comentarios
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

-- 4. TICKERS (Cintillo de noticias/alertas)
CREATE TABLE IF NOT EXISTS tickers (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    tag TEXT,
    type TEXT DEFAULT 'alert', -- alert, score, ad
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. CONFIGURACIÓN (Settings)
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CATEGORÍAS (Categories)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT,
    bg_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. GALERÍA DE IMÁGENES (Gallery)
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    filename TEXT,
    alt_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. FARMACIAS (Pharmacies)
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

-- 9. FARMACIAS DE TURNO (Pharmacy Duty)
CREATE TABLE IF NOT EXISTS pharmacy_duty (
    id SERIAL PRIMARY KEY,
    pharmacy_id INTEGER REFERENCES pharmacies(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date)
);

-- =====================================================
-- DATOS INICIALES (Solo se insertan si no existen)
-- =====================================================

INSERT INTO settings (key, value) VALUES ('edition_number', '1') ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('cover_page_date', CURRENT_DATE::text) ON CONFLICT (key) DO NOTHING;
