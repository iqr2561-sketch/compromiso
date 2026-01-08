-- =====================================================
-- SCRIPT DE ACTUALIZACIÓN DE BASE DE DATOS
-- Ejecuta este script SOLO si necesitas actualizar una base de datos existente
-- que le falten las columnas nuevas.
-- =====================================================

-- 1. Actualizaciones para la tabla NEWS (Programación de noticias)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news' AND column_name='scheduled_at') THEN
        ALTER TABLE news ADD COLUMN scheduled_at TIMESTAMP WITH TIME ZONE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news' AND column_name='status') THEN
        ALTER TABLE news ADD COLUMN status TEXT DEFAULT 'published';
    END IF;
END $$;

-- 2. Actualizaciones para la tabla PHARMACIES (Ubicación)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pharmacies' AND column_name='city') THEN
        ALTER TABLE pharmacies ADD COLUMN city TEXT DEFAULT 'Central';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pharmacies' AND column_name='lat') THEN
        ALTER TABLE pharmacies ADD COLUMN lat DECIMAL(10, 8) DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pharmacies' AND column_name='lng') THEN
        ALTER TABLE pharmacies ADD COLUMN lng DECIMAL(11, 8) DEFAULT 0;
    END IF;
END $$;

-- 3. Actualizaciones para la tabla ADS (Subtítulos y botones)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ads' AND column_name='sub_content') THEN
        ALTER TABLE ads ADD COLUMN sub_content TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ads' AND column_name='button') THEN
        ALTER TABLE ads ADD COLUMN button TEXT;
    END IF;
END $$;

-- 4. Actualizaciones para la tabla SETTINGS (Fechas de actualización)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='updated_at') THEN
        ALTER TABLE settings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;
