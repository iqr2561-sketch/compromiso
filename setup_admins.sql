-- =====================================================
-- TABLA DE ADMINISTRADORES - DIARIO COMPROMISO
-- =====================================================

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, -- Para producción usar hashes, para este caso usaremos texto plano por simplicidad solicitada
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserción del usuario por defecto
INSERT INTO admins (username, password, name) 
VALUES ('redaccion', 'Fede1234', 'Redacción Compromiso')
ON CONFLICT (username) DO NOTHING;
