-- Migration to add scheduled publication support
ALTER TABLE news ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE news ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published'; -- 'published' or 'scheduled'
