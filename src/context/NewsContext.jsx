import React, { createContext, useContext, useState } from 'react';

const NewsContext = createContext();

export const useNews = () => useContext(NewsContext);

export const NewsProvider = ({ children }) => {
    const [news, setNews] = useState([
        {
            id: 1,
            title: "La IA Generativa: ¿El fin de la creatividad humana?",
            content: "Expertos debaten sobre el impacto de las nuevas herramientas de inteligencia artificial en el arte, la música y el desarrollo de software.",
            category: "Tech & Futuro",
            author: "Ana García",
            date: "Hace 5 min",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1600",
            isHero: true,
            timeRead: "5 min"
        },
        {
            id: 2,
            title: "Misión Mars 2026: El primer asentamiento humano",
            content: "SpaceX confirma los planes para la primera base permanente en el planeta rojo, un hito que cambiará la historia.",
            category: "Tech",
            author: "Elon Musk",
            date: "Hace 1 hora",
            image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=1600",
            isHero: true,
            timeRead: "8 min"
        },
        {
            id: 3,
            title: "Inauguración del Gran Túnel Bioceánico",
            content: "Unirá Chile y Argentina en un trayecto de solo 2 horas, revolucionando el comercio en el sur.",
            category: "Actualidad",
            date: "Hoy",
            image: "https://images.unsplash.com/photo-1451187530221-87c062f43c21?auto=format&fit=crop&q=80&w=800",
            isHero: true
        }
    ]);

    const [flashTickers, setFlashTickers] = useState([
        { id: 1, text: "Urgente: Nuevas medidas económicas anunciadas para el próximo mes", tag: "BREAKING NEWS", type: 'alert' },
        { id: 2, text: "FINAL: Real Madrid 2 - 1 Barcelona (La Liga)", tag: "DEPORTES", type: 'score' },
        { id: 5, text: "¡PUBLICIDAD! Adquiere tu nuevo Tesla con 0% de interés este mes", tag: "PUBLICIDAD", type: 'ad' }
    ]);

    const [scores, setScores] = useState([
        { id: 1, home: "Social", away: "Ferro", homeScore: 0, awayScore: 1, homeLogo: "https://ui-avatars.com/api/?name=S&background=256af4&color=fff", awayLogo: "https://ui-avatars.com/api/?name=F&background=00d68f&color=fff", time: "Finalizado", date: "2026-01-01" },
        { id: 2, home: "Rivadavia", away: "Huracan", homeScore: 2, awayScore: 2, homeLogo: "https://ui-avatars.com/api/?name=R&background=f4256a&color=fff", awayLogo: "https://ui-avatars.com/api/?name=H&background=ff6b00&color=fff", time: "85'", date: "2026-01-04" }
    ]);

    const [categories, setCategories] = useState([
        { id: 1, name: "Actualidad", color: "primary", bgImage: "https://images.unsplash.com/photo-1504711432869-efd5971ee14b?auto=format&fit=crop&q=80&w=1600" },
        { id: 2, name: "Tech", color: "accent-purple", bgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600" },
        { id: 3, name: "Deportes", color: "accent-orange", bgImage: "https://images.unsplash.com/photo-1461891213817-5e204c71ef2e?auto=format&fit=crop&q=80&w=1600" },
        { id: 4, name: "Viral", color: "accent-pink", bgImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1600" },
        { id: 5, name: "Finanzas", color: "accent-green", bgImage: "https://images.unsplash.com/photo-1611974714024-462cd9dc10c7?auto=format&fit=crop&q=80&w=1600" }
    ]);

    const [ads, setAds] = useState([
        { id: 1, type: 'premium', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1600', link: '#', active: true },
        { id: 2, type: 'square', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800', link: '#', active: true }
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

    const addNews = (item) => setNews(prev => [{ ...item, id: Date.now() }, ...prev]);
    const deleteNews = (id) => setNews(prev => prev.filter(n => n.id !== id));
    const updateNews = (id, item) => setNews(prev => prev.map(n => n.id === id ? { ...n, ...item } : n));

    const addTicker = (item) => setFlashTickers(prev => [...prev, { ...item, id: Date.now() }]);
    const deleteTicker = (id) => setFlashTickers(prev => prev.filter(t => t.id !== id));
    const updateTicker = (id, item) => setFlashTickers(prev => prev.map(t => t.id === id ? { ...t, ...item } : t));

    const addCategory = (cat) => setCategories(prev => [...prev, { ...cat, id: Date.now() }]);
    const deleteCategory = (id) => setCategories(prev => prev.filter(c => c.id !== id));
    const updateCategory = (id, cat) => setCategories(prev => prev.map(c => c.id === id ? { ...c, ...cat } : c));

    const addAd = (ad) => setAds(prev => [...prev, { ...ad, id: Date.now() }]);
    const deleteAd = (id) => setAds(prev => prev.filter(a => a.id !== id));
    const updateAd = (id, item) => setAds(prev => prev.map(a => a.id === id ? { ...a, ...item } : a));

    const addVideo = (vid) => setVideos(prev => [...prev, { ...vid, id: Date.now() }]);
    const deleteVideo = (id) => setVideos(prev => prev.filter(v => v.id !== id));
    const updateVideo = (id, item) => setVideos(prev => prev.map(v => v.id === id ? { ...v, ...item } : v));

    const addToGallery = (img) => setImageGallery(prev => [img, ...prev]);

    const addPharmacy = (p) => setPharmacies(prev => [...prev, { ...p, id: Date.now() }]);
    const deletePharmacy = (id) => setPharmacies(prev => prev.filter(p => p.id !== id));
    const updatePharmacy = (id, p) => setPharmacies(prev => prev.map(phi => phi.id === id ? { ...phi, ...p } : phi));
    const setDuty = (date, pharmacyId) => setPharmacyDuty(prev => {
        const others = prev.filter(d => d.date !== date);
        return [...others, { date, pharmacyId }];
    });

    return (
        <NewsContext.Provider value={{
            news, addNews, deleteNews, updateNews,
            flashTickers, addTicker, deleteTicker, updateTicker,
            scores, setScores,
            categories, addCategory, deleteCategory, updateCategory,
            ads, addAd, deleteAd, updateAd,
            videos, addVideo, deleteVideo, updateVideo,
            imageGallery, addToGallery,
            pharmacies, addPharmacy, deletePharmacy, updatePharmacy,
            pharmacyDuty, setDuty
        }}>
            {children}
        </NewsContext.Provider>
    );
};
