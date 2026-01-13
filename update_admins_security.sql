-- =====================================================
-- ACTUALIZACIÓN DE SEGURIDAD - TABLA ADMINS
-- =====================================================

ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS failed_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS recovery_code TEXT DEFAULT 'COMPROMISO-2026';

-- Nota: El recovery_code por defecto es 'COMPROMISO-2026'
