-- =====================================================
-- SQL INSERT: REAL PHARMACIES
-- Ejecutar en Neon SQL Editor para cargar el listado completo
-- =====================================================

-- Limpiar tabla actual (Opcional: descomentar si quieres borrar las anteriores)
-- TRUNCATE TABLE pharmacies CASCADE;

INSERT INTO pharmacies (name, address, phone, city) VALUES 
('FARMACIA ABAIT', 'Lamadrid Nº 346', '443396', 'Dolores'),
('FARMACIA BELLATI', 'San Martín Nº 198', '442395', 'Dolores'),
('FARMACIA DEL PUEBLO', 'Buenos Aires Nº 200', '442200', 'Dolores'),
('FARMACIA GOPAR', 'A. del Valle Nº 424', '461744', 'Dolores'),
('FARMACIA MARASCO', 'Bs. As. Nº 717', '444715', 'Dolores'),
('FARMACIA NOVADOLORES', 'Pilotto y Pringles', '501396', 'Dolores'),
('FARMACIA PANTALEÓN', 'E. Quadri Nº 99', '442594', 'Dolores'),
('FARMACIA RUIZ', 'Mitre Nº 496', '446157', 'Dolores'),
('FARMACIA SPERONI', 'Mitre Nº 82', '442206', 'Dolores'),
('FARMACIA TAMAGNO', 'Lamadrid Nº 61', '505474', 'Dolores');

-- Verificar carga
SELECT * FROM pharmacies ORDER BY name;
