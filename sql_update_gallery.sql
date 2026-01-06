-- =====================================================
-- SQL UPDATE FOR DIARIO COMPROMISO
-- Run this script in your Neon SQL database
-- Date: 2026-01-06
-- =====================================================

-- GALLERY TABLE (for image storage persistence)
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    filename TEXT,
    alt_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PHARMACIES TABLE (if not exists)
CREATE TABLE IF NOT EXISTS pharmacies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PHARMACY DUTY TABLE (for scheduling which pharmacy is on duty)
CREATE TABLE IF NOT EXISTS pharmacy_duty (
    id SERIAL PRIMARY KEY,
    pharmacy_id INTEGER REFERENCES pharmacies(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date)
);

-- Verify tables were created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
