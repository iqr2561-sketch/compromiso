-- =====================================================
-- SQL UPDATE: PHARMACIES & DUTY TABLES
-- Ejecutar en Neon SQL Editor
-- =====================================================

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

-- Datose de ejemplo (opcional)
INSERT INTO pharmacies (name, address, phone, city) 
VALUES ('Farmacia Central', 'Av. Principal 123', '555-0101', 'Centro')
ON CONFLICT DO NOTHING;
