-- Mark first 5 news as hero (featured in carousel)
UPDATE news SET is_hero = true 
WHERE id IN (
    SELECT id FROM news 
    ORDER BY created_at DESC 
    LIMIT 5
);

-- Display updated news
SELECT id, title, is_hero, image FROM news ORDER BY created_at DESC LIMIT 10;
