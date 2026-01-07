-- =====================================================
-- SQL POPULATE: RESTORE DEFAULT PHARMACIES
-- Ejecutar en Neon SQL Editor
-- =====================================================

-- Insertar Farmacia Central
INSERT INTO pharmacies (name, address, phone, city) 
VALUES ('Farmacia Central', 'Av. Principal 123', '555-0101', 'Centro');

-- Insertar Farmacia Norte
INSERT INTO pharmacies (name, address, phone, city) 
VALUES ('Farmacia Norte', 'Calle Falsa 456', '555-0202', 'Norte');

-- Verificar
SELECT * FROM pharmacies;
