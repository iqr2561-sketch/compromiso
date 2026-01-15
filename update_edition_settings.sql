-- Add edition mode control to settings
INSERT INTO settings (key, value) VALUES 
('edition_auto_increment', 'true'),
('edition_manual_override', '')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Check current settings
SELECT key, value FROM settings WHERE key LIKE 'edition%' ORDER BY key;
