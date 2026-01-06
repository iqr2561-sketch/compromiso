-- SQL SCHEMA FOR DIARIO COMPROMISO (NEON SQL)

-- NEWS TABLE
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT NOT NULL,
    author TEXT,
    date TEXT,
    image TEXT,
    is_hero BOOLEAN DEFAULT FALSE,
    is_flash BOOLEAN DEFAULT FALSE,
    time_read TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ADS TABLE
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

-- COMMENTS TABLE
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES news(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    comment TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TICKERS TABLE
CREATE TABLE IF NOT EXISTS tickers (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    tag TEXT,
    type TEXT DEFAULT 'alert', -- alert, score, ad
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
