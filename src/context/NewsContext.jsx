import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

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
    const [pharmacies, setPharmacies] = useState([]);
    const [pharmacyDuty, setPharmacyDuty] = useState([]);
    const [comments, setComments] = useState([]);
    const [footerSettings, setFooterSettings] = useState({
        logo: '',
        description: 'Periodismo moderno para la generación digital. Rápido, veraz y visualmente impactante.',
        qr_image: '',
        column_2_title: 'Propiedad Intelectual',
        column_3_title: '',
        column_4_title: 'AFIP - Data Fiscal',
        facebook_url: '#',
        instagram_url: '#',
        youtube_url: '#',
        twitter_url: '#',
        te_acordas_bg: 'https://images.unsplash.com/photo-1544253109-c88ce53cc9d0?auto=format&fit=crop&q=80&w=1600',
        copyright: `© ${new Date().getFullYear()} Diario Digital Inc. Todos los derechos reservados.`
    });
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Initial fetch
    useEffect(() => {
        fetchNews();
        fetchSettings();
        fetchCategories();
        fetchGallery();
        fetchPharmacies();
        fetchDuties();
        fetchComments();
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            const res = await fetch('/api/ads');
            if (res.ok) {
                const data = await res.json();
                setAds(data);
            }
        } catch (err) {
            console.error('Failed to fetch ads:', err);
        }
    };

    const fetchNews = async (isAdmin = false) => {
        try {
            const url = isAdmin ? '/api/news?all=true' : '/api/news';
            const res = await fetch(url);
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

                // Footer settings
                const footer = { ...footerSettings };
                Object.keys(data).forEach(key => {
                    if (key.startsWith('footer_')) {
                        const footerKey = key.replace('footer_', '');
                        footer[footerKey] = data[key];
                    }
                });
                setFooterSettings(footer);

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
                setImageGallery(urls);
            } else {
                console.warn('Gallery API returned error status:', res.status);
            }
        } catch (err) {
            // Silent fail - keep the default gallery images
            console.warn('Failed to fetch gallery, using defaults:', err.message);
        }
    };

    const fetchPharmacies = async () => {
        try {
            const res = await fetch('/api/pharmacies');
            if (res.ok) {
                const data = await res.json();
                setPharmacies(data);
            }
        } catch (err) {
            console.error('Failed to fetch pharmacies:', err);
        }
    };

    const fetchDuties = async () => {
        try {
            const res = await fetch('/api/pharmacy-duties');
            if (res.ok) {
                const data = await res.json();
                setPharmacyDuty(data);
            }
        } catch (err) {
            console.error('Failed to fetch duties:', err);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await fetch('/api/comments');
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (err) {
            console.error('Failed to fetch comments:', err);
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
            console.log('NewsContext: updateCoverPage called. Image length:', image ? image.length : 0);

            const res1 = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'cover_page_image', value: image })
            });

            if (!res1.ok) {
                const errText = await res1.text();
                console.error('NewsContext: Failed to update cover image. Status:', res1.status, errText);
            }

            const res2 = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'cover_page_date', value: date })
            });

            if (!res2.ok) {
                const errText = await res2.text();
                console.error('NewsContext: Failed to update cover date. Status:', res2.status, errText);
            }

            if (res1.ok && res2.ok) {
                console.log('NewsContext: Cover page updated successfully');
                setCoverPage({ image, date });
                return true;
            }
            return false;
        } catch (err) {
            console.error('NewsContext: Exception in updateCoverPage:', err);
            return false;
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
                return true;
            }
        } catch (err) {
            console.error('Failed to add news:', err);
        }
        return false;
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
                return true;
            }
        } catch (err) {
            console.error('Failed to update news:', err);
        }
        return false;
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

    const addAd = async (ad) => {
        try {
            console.log('NewsContext: addAd called with:', ad);
            console.log('NewsContext: Image length:', ad.image ? ad.image.length : 'NO IMAGE');

            const res = await fetch('/api/ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ad)
            });

            console.log('NewsContext: Response status:', res.status);

            if (res.ok) {
                const newAd = await res.json();
                console.log('NewsContext: New ad created:', newAd);
                setAds(prev => [...prev, newAd]);
                return true;
            } else {
                const errorText = await res.text();
                console.error('NewsContext: Failed to add ad. Status:', res.status, 'Error:', errorText);
            }
        } catch (err) {
            console.error('NewsContext: Exception in addAd:', err);
        }
        return false;
    };

    const deleteAd = async (id) => {
        try {
            const res = await fetch(`/api/ads?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setAds(prev => prev.filter(a => a.id !== id));
                return true;
            }
        } catch (err) {
            console.error('Failed to delete ad:', err);
        }
        return false;
    };

    const updateAd = async (id, item) => {
        try {
            console.log('NewsContext: updateAd called with id:', id, 'item:', item);
            console.log('NewsContext: Image length:', item.image ? item.image.length : 'NO IMAGE');

            const res = await fetch('/api/ads', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...item })
            });

            console.log('NewsContext: Update response status:', res.status);

            if (res.ok) {
                const updated = await res.json();
                console.log('NewsContext: Ad updated:', updated);
                setAds(prev => prev.map(a => a.id === id ? updated : a));
                return true;
            } else {
                const errorText = await res.text();
                console.error('NewsContext: Failed to update ad. Status:', res.status, 'Error:', errorText);
            }
        } catch (err) {
            console.error('NewsContext: Exception in updateAd:', err);
        }
        return false;
    };

    const addVideo = (vid) => setVideos(prev => [...prev, { ...vid, id: Date.now() }]);
    const deleteVideo = (id) => setVideos(prev => prev.filter(v => v.id !== id));
    const updateVideo = (id, item) => setVideos(prev => prev.map(v => v.id === id ? { ...v, ...item } : v));

    const addPharmacy = async (p) => {
        try {
            const res = await fetch('/api/pharmacies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(p)
            });
            if (res.ok) {
                const newP = await res.json();
                setPharmacies(prev => [...prev, newP]);
            }
        } catch (err) {
            console.error('Failed to add pharmacy:', err);
        }
    };

    const deletePharmacy = async (id) => {
        try {
            await fetch(`/api/pharmacies?id=${id}`, { method: 'DELETE' });
            setPharmacies(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Failed to delete pharmacy:', err);
        }
    };

    const updatePharmacy = async (id, p) => {
        try {
            const res = await fetch('/api/pharmacies', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...p })
            });
            if (res.ok) {
                const updated = await res.json();
                setPharmacies(prev => prev.map(phi => phi.id === id ? updated : phi));
            }
        } catch (err) {
            console.error('Failed to update pharmacy:', err);
        }
    };

    const setDuty = async (date, pharmacyId) => {
        try {
            const res = await fetch('/api/pharmacy-duties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, pharmacyId })
            });

            if (res.ok) {
                setPharmacyDuty(prev => {
                    const others = prev.filter(d => d.date !== date);
                    if (pharmacyId === null) return others;
                    return [...others, { date, pharmacyId }];
                });
            }
        } catch (err) {
            console.error('Failed to set duty:', err);
        }
    };

    const deleteComment = async (id) => {
        try {
            const res = await fetch(`/api/comments?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setComments(prev => prev.filter(c => c.id !== id));
            }
        } catch (err) {
            console.error('Failed to delete comment:', err);
        }
    };

    const updateCommentStatus = async (id, status) => {
        try {
            const res = await fetch('/api/comments', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) {
                const updated = await res.json();
                setComments(prev => prev.map(c => c.id === id ? updated : c));
            }
        } catch (err) {
            console.error('Failed to update comment status:', err);
        }
    };

    const updateFooterSettings = async (settings) => {
        try {
            console.log('NewsContext: updateFooterSettings called with:', settings);
            const promises = Object.entries(settings).map(([key, value]) => {
                return fetch('/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: `footer_${key}`, value })
                });
            });

            const results = await Promise.all(promises);
            const allOk = results.every(res => res.ok);

            if (allOk) {
                setFooterSettings(prev => ({ ...prev, ...settings }));
                return true;
            }
        } catch (err) {
            console.error('Failed to update footer settings:', err);
        }
        return false;
    };

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
            comments, deleteComment, updateCommentStatus,
            aiConfig, updateAiConfig,
            footerSettings, updateFooterSettings,
            fetchNews,
            showToast,
            reorderCategories: setCategories
        }}>
            {children}

            {/* Global Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[3000] px-6 py-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-4 min-w-[320px]"
                    >
                        <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                            {toast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        </div>
                        <p className="text-sm font-bold text-white pr-8">{toast.message}</p>
                        <button
                            onClick={() => setToast(null)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </NewsContext.Provider>
    );
};
