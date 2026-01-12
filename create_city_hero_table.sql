CREATE TABLE IF NOT EXISTS city_hero_images (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO city_hero_images (url) VALUES 
('/dolores-panoramic.png');
