-- =====================================================
-- SQL UPDATE: GALLERY TABLE ONLY
-- Ejecutar en Neon SQL Editor
-- =====================================================

-- Opcional: Si quieres reiniciar la tabla desde cero, descomenta la siguiente línea:
-- DROP TABLE IF EXISTS gallery;

CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    filename TEXT,
    alt_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Verificar creación
SELECT * FROM gallery;
