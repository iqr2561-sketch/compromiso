-- Insert sample images into gallery for testing
INSERT INTO gallery (url, filename, alt_text) VALUES 
('https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', 'image-1.jpg', 'Imagen 1'),
('https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800', 'image-2.jpg', 'Imagen 2'),
('https://images.unsplash.com/photo-1504711432869-efd5971ee14b?auto=format&fit=crop&q=80&w=800', 'image-3.jpg', 'Imagen 3'),
('https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800', 'image-4.jpg', 'Imagen 4'),
('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800', 'image-5.jpg', 'Imagen 5'),
('https://images.unsplash.com/photo-1614680376593-902f74cc0d41?auto=format&fit=crop&q=80&w=800', 'image-6.jpg', 'Imagen 6'),
('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800', 'image-7.jpg', 'Imagen 7'),
('https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800', 'image-8.jpg', 'Imagen 8'),
('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800', 'image-9.jpg', 'Imagen 9'),
('https://images.unsplash.com/photo-1544253109-c88ce53cc9d0?auto=format&fit=crop&q=80&w=800', 'image-10.jpg', 'Imagen 10')
ON CONFLICT DO NOTHING;

-- Display all gallery images
SELECT id, url, filename FROM gallery ORDER BY created_at DESC;
