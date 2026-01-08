-- Script completo para asegurar que la tabla ads funcione correctamente
-- Ejecutar este script en la consola de PostgreSQL o en la herramienta de administración de tu base de datos

-- Paso 1: Crear la tabla si no existe
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

-- Paso 2: Asegurar que todas las columnas existan (en caso de que la tabla ya existiera sin algunas columnas)
DO $$ 
BEGIN 
    -- Verificar y agregar columna 'type' si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ads' AND column_name='type') THEN
        ALTER TABLE ads ADD COLUMN type TEXT NOT NULL DEFAULT 'premium';
    END IF;
    
    -- Verificar y agregar columna 'title' si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ads' AND column_name='title') THEN
        ALTER TABLE ads ADD COLUMN title TEXT;
    END IF;
    
    -- Verificar y agregar columna 'content' si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ads' AND column_name='content') THEN
        ALTER TABLE ads ADD COLUMN content TEXT;
    END IF;
    
    -- Verificar y agregar columna 'sub_content' si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ads' AND column_name='sub_content') THEN
        ALTER TABLE ads ADD COLUMN sub_content TEXT;
    END IF;
    
    -- Verificar y agregar columna 'image' si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ads' AND column_name='image') THEN
        ALTER TABLE ads ADD COLUMN image TEXT;
    END IF;
    
    -- Verificar y agregar columna 'link' si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ads' AND column_name='link') THEN
        ALTER TABLE ads ADD COLUMN link TEXT;
    END IF;
    
    -- Verificar y agregar columna 'button' si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ads' AND column_name='button') THEN
        ALTER TABLE ads ADD COLUMN button TEXT;
    END IF;
    
    -- Verificar y agregar columna 'active' si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ads' AND column_name='active') THEN
        ALTER TABLE ads ADD COLUMN active BOOLEAN DEFAULT TRUE;
    END IF;
    
    -- Verificar y agregar columna 'created_at' si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ads' AND column_name='created_at') THEN
        ALTER TABLE ads ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Paso 3: Verificar la estructura de la tabla
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'ads'
ORDER BY ordinal_position;

-- Paso 4: Ver cuántos registros hay
SELECT COUNT(*) as total_ads FROM ads;

-- Paso 5: Ver los últimos 5 anuncios con información resumida de la imagen
SELECT 
    id, 
    type, 
    title,
    CASE 
        WHEN image IS NULL THEN 'NULL'
        WHEN image = '' THEN 'EMPTY'
        WHEN LENGTH(image) > 100 THEN CONCAT(LEFT(image, 50), '... (', LENGTH(image), ' chars)')
        ELSE image
    END as image_preview,
    link,
    active,
    created_at
FROM ads 
ORDER BY created_at DESC 
LIMIT 5;
