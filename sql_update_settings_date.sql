-- Create settings table if it doesn't exist (it should, but just to be safe)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Insert default cover_page_date if not exists
INSERT INTO settings (key, value)
VALUES ('cover_page_date', CURRENT_DATE::text)
ON CONFLICT (key) DO NOTHING;

-- Ensure edition_number exists
INSERT INTO settings (key, value)
VALUES ('edition_number', '1')
ON CONFLICT (key) DO NOTHING;
