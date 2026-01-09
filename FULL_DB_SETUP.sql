-- ====================================================================
-- DIARIO COMPROMISO - ESQUEMA COMPLETO Y DATOS INICIALES (ENERO 2026)
-- Este archivo contiene la estructura total para una nueva base de datos.
-- ====================================================================

-- 1. TABLA DE NOTICIAS
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
    time_read TEXT DEFAULT '2 min',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE PUBLICIDAD
CREATE TABLE IF NOT EXISTS ads (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL, -- 'premium', 'square', 'horizontal', 'hero_1', 'hero_2', 'hero_3', 'sidebar_1', 'footer_1', etc.
    title TEXT,
    content TEXT,
    sub_content TEXT,
    image TEXT,
    link TEXT,
    button TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA DE COMENTARIOS
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES news(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    comment TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

-- 4. TABLA DE TICKERS (Cintillo)
CREATE TABLE IF NOT EXISTS tickers (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    tag TEXT,
    type TEXT DEFAULT 'alert', -- alert, score, ad
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLA DE CONFIGURACIÓN (Settings)
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABLA DE CATEGORÍAS
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT 'primary',
    bg_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABLA DE GALERÍA
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    filename TEXT,
    alt_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABLA DE FARMACIAS
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

-- 9. TABLA DE TURNOS DE FARMACIA
CREATE TABLE IF NOT EXISTS pharmacy_duty (
    id SERIAL PRIMARY KEY,
    pharmacy_id INTEGER REFERENCES pharmacies(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date)
);

-- =====================================================
-- DATOS DE CONFIGURACIÓN INICIAL (SETTINGS)
-- =====================================================

INSERT INTO settings (key, value) VALUES 
('edition_number', '42891'),
('cover_page_date', CURRENT_DATE::text),
('footer_description', 'Periodismo moderno para la generación digital. Rápido, veraz y visualmente impactante.'),
('footer_column_2_title', 'Propiedad Intelectual'),
('footer_column_4_title', 'AFIP - Data Fiscal'),
('footer_copyright', '© 2026 Diario Digital Inc. Todos los derechos reservados.'),
('footer_te_acordas_bg', 'https://images.unsplash.com/photo-1544253109-c88ce53cc9d0?auto=format&fit=crop&q=80&w=1600'),
('ai_enabled', 'false'),
('ai_model', 'gemini-1.5-flash')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- CATEGORÍAS POR DEFECTO
-- =====================================================

INSERT INTO categories (name, color) VALUES 
('Locales', 'primary'),
('Deportes', 'accent-pink'),
('Actualidad', 'accent-green'),
('Cultura', 'accent-purple'),
('¿Te Acordás Dolores?', 'accent-orange')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- MUESTRA DE PUBLICIDAD (PLACEHOLDERS)
-- =====================================================

INSERT INTO ads (type, title, content, active) VALUES 
('premium', 'Anunciate Aquí', 'Llega a miles de lectores diariamente', true),
('horizontal', 'Espacio Publicitario', 'Contactanos para destacar tu negocio', true),
('square', 'Publicidad Local', 'Ideal para comercios de la zona', true);
