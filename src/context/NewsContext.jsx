import React, { createContext, useContext, useState, useEffect } from 'react';

const NewsContext = createContext();

export const useNews = () => useContext(NewsContext);

export const NewsProvider = ({ children }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editionNumber, setEditionNumber] = useState('42891');
    const [coverPage, setCoverPage] = useState({
        image: 'https://images.unsplash.com/photo-1504711432869-efd5971ee14b?auto=format&fit=crop&q=80&w=800',
        date: new Date().toISOString().split('T')[0]
    });
    const [aiConfig, setAiConfig] = useState({
        enabled: false,
        apiKey: '',
        model: 'gemini-1.5-flash'
    });
    const [categories, setCategories] = useState([]);
    const [flashTickers, setFlashTickers] = useState([
        { id: 1, text: "Urgente: Nuevas medidas económicas anunciadas para el próximo mes", tag: "BREAKING NEWS", type: 'alert' },
        { id: 2, text: "FINAL: Real Madrid 2 - 1 Barcelona (La Liga)", tag: "DEPORTES", type: 'score' },
        { id: 5, text: "¡PUBLICIDAD! Adquiere tu nuevo Tesla con 0% de interés este mes", tag: "PUBLICIDAD", type: 'ad' }
    ]);
    const [scores, setScores] = useState([
        { id: 1, home: "Social", away: "Ferro", homeScore: 0, awayScore: 1, homeLogo: "https://ui-avatars.com/api/?name=S&background=256af4&color=fff", awayLogo: "https://ui-avatars.com/api/?name=F&background=00d68f&color=fff", time: "Finalizado", date: "2026-01-01" },
        { id: 2, home: "Rivadavia", away: "Huracan", homeScore: 2, awayScore: 2, homeLogo: "https://ui-avatars.com/api/?name=R&background=f4256a&color=fff", awayLogo: "https://ui-avatars.com/api/?name=H&background=ff6b00&color=fff", time: "85'", date: "2026-01-04" }
    ]);
    const [ads, setAds] = useState([
        { id: 1, type: 'premium', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1600', link: '#', active: true },
        { id: 2, type: 'square', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800', link: '#', active: true },
        { id: 3, type: 'horizontal', image: 'https://images.unsplash.com/photo-1614680376593-902f74cc0d41?auto=format&fit=crop&q=80&w=1600', link: '#', active: true },
        { id: 4, type: 'horizontal', image: 'https://images.unsplash.com/photo-1504711432869-efd5971ee14b?auto=format&fit=crop&q=80&w=1600', link: '#', active: true },
        { id: 5, type: 'hero_1', image: '', link: '#', active: false },
        { id: 6, type: 'hero_2', image: '', link: '#', active: false },
        { id: 7, type: 'hero_3', image: '', link: '#', active: false }
    ]);
    const [videos, setVideos] = useState([
        { id: 1, title: "Crónica: El despertar de la IA en la industria local", views: "12k", duration: "3:45", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800", category: "Tech & Futuro", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
    ]);
    const [imageGallery, setImageGallery] = useState([
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=400'
    ]);
    const [pharmacies, setPharmacies] = useState([
        { id: 1, name: "Farmacia Central", address: "Av. Principal 123", phone: "555-0101", city: "Centro", location: { lat: 0, lng: 0 } },
        { id: 2, name: "Farmacia Norte", address: "Calle Falsa 456", phone: "555-0202", city: "Norte", location: { lat: 0, lng: 0 } }
    ]);
    const [pharmacyDuty, setPharmacyDuty] = useState([
        { date: "2026-01-04", pharmacyId: 1 },
        { date: "2026-01-05", pharmacyId: 2 }
    ]);

    // Initial fetch
    useEffect(() => {
        fetchNews();
        fetchSettings();
        fetchCategories();
        fetchGallery();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await fetch('/api/news');
            if (res.ok) {
                const data = await res.json();
                setNews(data);
            }
        } catch (err) {
            console.error('Failed to fetch news:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                if (data.edition_number) {
                    setEditionNumber(data.edition_number);
                }
                if (data.cover_page_image) {
                    setCoverPage(prev => ({ ...prev, image: data.cover_page_image }));
                }
                if (data.cover_page_date) {
                    setCoverPage(prev => ({ ...prev, date: data.cover_page_date }));
                }
                if (data.ai_enabled) {
                    setAiConfig(prev => ({ ...prev, enabled: data.ai_enabled === 'true' }));
                }
                if (data.ai_api_key) {
                    setAiConfig(prev => ({ ...prev, apiKey: data.ai_api_key }));
                }
                if (data.ai_model) {
                    setAiConfig(prev => ({ ...prev, model: data.ai_model }));
                }

                // Trigger daily increment check on load
                fetch('/api/cron-increment');
            }
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const fetchGallery = async () => {
        try {
            const res = await fetch('/api/gallery');
            if (res.ok) {
                const data = await res.json();
                // Extract just the URLs from the gallery objects
                const urls = data.map(img => img.url);
                if (urls.length > 0) {
                    setImageGallery(urls);
                }
            } else {
                // If gallery API fails (404, 500, etc.), just keep the default values
                console.warn('Gallery API returned error status:', res.status);
            }
        } catch (err) {
            // Silent fail - keep the default gallery images
            console.warn('Failed to fetch gallery, using defaults:', err.message);
        }
    };

    const addToGallery = async (url, filename = null) => {
        try {
            const res = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, filename })
            });
            if (res.ok) {
                setImageGallery(prev => [url, ...prev]);
                return true;
            }
        } catch (err) {
            console.error('Failed to add to gallery:', err);
        }
        return false;
    };

    const deleteFromGallery = async (url) => {
        // For now, just remove from state - full implementation would need id tracking
        setImageGallery(prev => prev.filter(img => img !== url));
    };

    const updateEdition = async (newVal) => {
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'edition_number', value: newVal })
            });
            if (res.ok) {
                setEditionNumber(newVal.toString());
            }
        } catch (err) {
            console.error('Failed to update edition:', err);
        }
    };

    const updateCoverPage = async (image, date) => {
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'cover_page_image', value: image })
            });
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'cover_page_date', value: date })
            });
            setCoverPage({ image, date });
        } catch (err) {
            console.error('Failed to update cover page:', err);
        }
    };

    const updateAiConfig = async (config) => {
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'ai_enabled', value: config.enabled.toString() })
            });
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'ai_api_key', value: config.apiKey })
            });
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'ai_model', value: config.model })
            });
            setAiConfig(config);
        } catch (err) {
            console.error('Failed to update AI config:', err);
        }
    };

    const addNews = async (item) => {
        try {
            const res = await fetch('/api/news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            if (res.ok) {
                const newItem = await res.json();
                setNews(prev => [newItem, ...prev]);
            }
        } catch (err) {
            console.error('Failed to add news:', err);
        }
    };

    const deleteNews = async (id) => {
        try {
            const res = await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setNews(prev => prev.filter(n => n.id !== id));
            }
        } catch (err) {
            console.error('Failed to delete news:', err);
        }
    };

    const updateNews = async (id, item) => {
        try {
            const res = await fetch('/api/news', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...item })
            });
            if (res.ok) {
                const updatedItem = await res.json();
                setNews(prev => prev.map(n => n.id === id ? updatedItem : n));
            }
        } catch (err) {
            console.error('Failed to update news:', err);
        }
    };

    const addCategory = async (cat) => {
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: cat.name,
                    color: cat.color,
                    bg_image: cat.bgImage || cat.bg_image
                })
            });
            if (res.ok) {
                const newCat = await res.json();
                setCategories(prev => [...prev, newCat]);
            }
        } catch (err) {
            console.error('Failed to add category:', err);
        }
    };

    const deleteCategory = async (id) => {
        try {
            const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCategories(prev => prev.filter(c => c.id !== id));
            }
        } catch (err) {
            console.error('Failed to delete category:', err);
        }
    };

    const updateCategory = async (id, cat) => {
        try {
            const res = await fetch('/api/categories', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    name: cat.name,
                    color: cat.color,
                    bg_image: cat.bgImage || cat.bg_image
                })
            });
            if (res.ok) {
                const updatedCat = await res.json();
                setCategories(prev => prev.map(c => c.id === id ? updatedCat : c));
            }
        } catch (err) {
            console.error('Failed to update category:', err);
        }
    };

    const addTicker = (item) => setFlashTickers(prev => [...prev, { ...item, id: Date.now() }]);
    const deleteTicker = (id) => setFlashTickers(prev => prev.filter(t => t.id !== id));
    const updateTicker = (id, item) => setFlashTickers(prev => prev.map(t => t.id === id ? { ...t, ...item } : t));

    const addAd = (ad) => setAds(prev => [...prev, { ...ad, id: Date.now() }]);
    const deleteAd = (id) => setAds(prev => prev.filter(a => a.id !== id));
    const updateAd = (id, item) => setAds(prev => prev.map(a => a.id === id ? { ...a, ...item } : a));

    const addVideo = (vid) => setVideos(prev => [...prev, { ...vid, id: Date.now() }]);
    const deleteVideo = (id) => setVideos(prev => prev.filter(v => v.id !== id));
    const updateVideo = (id, item) => setVideos(prev => prev.map(v => v.id === id ? { ...v, ...item } : v));

    const addPharmacy = (p) => setPharmacies(prev => [...prev, { ...p, id: Date.now() }]);
    const deletePharmacy = (id) => setPharmacies(prev => prev.filter(p => p.id !== id));
    const updatePharmacy = (id, p) => setPharmacies(prev => prev.map(phi => phi.id === id ? { ...phi, ...p } : phi));
    const setDuty = (date, pharmacyId) => setPharmacyDuty(prev => {
        const others = prev.filter(d => d.date !== date);
        return [...others, { date, pharmacyId }];
    });

    return (
        <NewsContext.Provider value={{
            news, addNews, deleteNews, updateNews, loading,
            editionNumber, updateEdition,
            coverPage, updateCoverPage,
            flashTickers, addTicker, deleteTicker, updateTicker,
            scores, setScores,
            categories, addCategory, deleteCategory, updateCategory,
            ads, addAd, deleteAd, updateAd,
            videos, addVideo, deleteVideo, updateVideo,
            imageGallery, addToGallery, deleteFromGallery,
            pharmacies, addPharmacy, deletePharmacy, updatePharmacy,
            pharmacyDuty, setDuty,
            aiConfig, updateAiConfig,
            reorderCategories: setCategories
        }}>
            {children}
        </NewsContext.Provider>
    );
};
