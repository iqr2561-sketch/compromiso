-- =====================================================
-- SQL FIX: ADD MISSING COLUMNS TO PHARMACIES
-- Ejecutar en Neon SQL Editor para corregir el error "column city does not exist"
-- =====================================================

-- Agregar columna 'city' si no existe
ALTER TABLE pharmacies ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Central';

-- Agregar columnas de ubicación si faltan (por si acaso)
ALTER TABLE pharmacies ADD COLUMN IF NOT EXISTS lat DECIMAL(10, 8) DEFAULT 0;
ALTER TABLE pharmacies ADD COLUMN IF NOT EXISTS lng DECIMAL(11, 8) DEFAULT 0;

-- Verificar la estructura final
SELECT * FROM pharmacies LIMIT 1;
