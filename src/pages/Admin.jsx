import React, { useState, useRef, useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import {
    Plus, Trash2, Edit3, Save, X, Image as ImageIcon, Zap, Trophy,
    Newspaper, LayoutDashboard, Settings, Video,
    LogOut, BarChart3, Users, Bell, Layers, Megaphone, Search, Filter,
    Upload, Globe, Grid, Crosshair, Calendar as CalendarIcon, MapPin, Phone, ArrowRight,
    ChevronLeft, ChevronRight, Clock, Cpu, Sparkles, Wand2, View, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Link } from 'react-router-dom';

const Admin = () => {
    console.log("Admin Component Loaded - Version 4.4");
    const {
        news, addNews, deleteNews, updateNews,
        flashTickers, addTicker, deleteTicker, updateTicker,
        scores, setScores,
        categories, addCategory, deleteCategory, updateCategory,
        ads, addAd, deleteAd, updateAd,
        videos, addVideo, deleteVideo, updateVideo,
        imageGallery, addToGallery,
        pharmacies, addPharmacy, deletePharmacy, updatePharmacy,
        pharmacyDuty, setDuty,
        editionNumber, updateEdition,
        coverPage, updateCoverPage,
        aiConfig, updateAiConfig,
        reorderCategories
    } = useNews();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [imageSource, setImageSource] = useState('url');
    const [displayDate, setDisplayDate] = useState(new Date().toISOString().split('T')[0]);
    const [pharmacyMode, setPharmacyMode] = useState('list'); // 'list' or 'schedule'
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [showGallery, setShowGallery] = useState(false);
    const [galleryTarget, setGalleryTarget] = useState('cover'); // 'cover' or block index
    const [editorBlocks, setEditorBlocks] = useState([{ type: 'text', content: '' }]);
    const [previewMode, setPreviewMode] = useState(false);
    const [showAiModal, setShowAiModal] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const [formData, setFormData] = useState({
        title: '', category: 'Locales', image: '', content: '', author: 'Admin', date: new Date().toISOString().split('T')[0],
        text: '', tag: 'DEPORTES', type: 'score', isHero: false, isFlash: false,
        home: '', away: '', homeScore: 0, awayScore: 0, homeLogo: '', awayLogo: '', time: 'Finalizado',
        name: '', color: 'primary', bgImage: '',
        link: '', active: true,
        views: '0', duration: '0:00', url: '',
        address: '', phone: '', city: 'Central'
    });

    useEffect(() => {
        if (categories.length > 0 && !formData.category) {
            setFormData(prev => ({ ...prev, category: categories[0].name }));
        }
    }, [categories]);

    const addBlock = (type) => {
        setEditorBlocks([...editorBlocks, { type, content: type === 'text' ? '' : 'https://images.unsplash.com/photo-1504711432869-efd5971ee14b' }]);
    };

    const updateBlock = (index, value) => {
        const newBlocks = [...editorBlocks];
        newBlocks[index].content = value;
        setEditorBlocks(newBlocks);
    };

    const removeBlock = (index) => {
        if (editorBlocks.length > 1) {
            setEditorBlocks(editorBlocks.filter((_, i) => i !== index));
        }
    };

    const resetForms = () => {
        setEditingId(null);
        setIsAdding(false);
        setFormData({
            title: '', category: categories[0]?.name || 'Actualidad', image: '', content: '', author: 'Admin', date: new Date().toISOString().split('T')[0],
            text: '', tag: 'DEPORTES', type: 'score', isHero: false, isFlash: false,
            home: '', away: '', homeScore: 0, awayScore: 0, homeLogo: '', awayLogo: '', time: 'Finalizado',
            name: '', color: 'primary', bgImage: '',
            link: '', active: true,
            views: '0', duration: '0:00', url: '',
            address: '', phone: '', city: 'Central'
        });
        setEditorBlocks([{ type: 'text', content: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (activeTab === 'news') {
            const newItem = {
                ...formData,
                content: JSON.stringify(editorBlocks),
                // Ensure date is valid, fallback to today
                date: formData.date || new Date().toISOString().split('T')[0]
            };
            if (editingId) {
                await updateNews(editingId, newItem);
            } else {
                await addNews(newItem);
            }
        } else if (activeTab === 'pharmacies') {
            editingId ? updatePharmacy(editingId, formData) : addPharmacy(formData);
        } else if (activeTab === 'categories') {
            editingId ? updateCategory(editingId, formData) : addCategory(formData);
        } else if (activeTab === 'ads') {
            editingId ? updateAd(editingId, formData) : addAd(formData);
        } else if (activeTab === 'cover') {
            updateCoverPage(formData.image, formData.date);
        } else if (activeTab === 'tickers') {
            editingId ? updateTicker(editingId, formData) : addTicker(formData);
        }

        resetForms();
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        const editData = { ...item, name: item.name || item.title || '', text: item.text || item.title || '' };
        setFormData(editData);

        if (activeTab === 'news' && item.content) {
            try {
                const parsed = JSON.parse(item.content);
                if (Array.isArray(parsed)) setEditorBlocks(parsed);
                else setEditorBlocks([{ type: 'text', content: item.content }]);
            } catch (e) {
                setEditorBlocks([{ type: 'text', content: item.content }]);
            }
        }
        setIsAdding(true);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                setFormData({ ...formData, image: base64 });
                addToGallery(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                addToGallery(reader.result);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = Array.from(e.dataTransfer.files);
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    addToGallery(reader.result);
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'news', label: 'Noticias', icon: Newspaper },
        { id: 'pharmacies', label: 'Farmacias', icon: Crosshair },
        { id: 'ads', label: 'Publicidad', icon: Megaphone },
        { id: 'videos', label: 'Videos', icon: Video },
        { id: 'gallery', label: 'Galería', icon: ImageIcon },
        { id: 'categories', label: 'Categorías', icon: Layers },
        { id: 'cover', label: 'Tapa Diaria', icon: LayoutDashboard },
        { id: 'tickers', label: 'Flash Tickers', icon: Zap },
        { id: 'settings', label: 'Configuración', icon: Settings },
    ];

    const upcomingDuties = pharmacyDuty
        .filter(d => d.date >= new Date().toISOString().split('T')[0])
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(d => ({ ...d, pharmacy: pharmacies.find(p => p.id === d.pharmacyId) }));

    const onDutyToday = pharmacies.find(p => p.id === pharmacyDuty.find(d => d.date === displayDate)?.pharmacyId);

    const filteredNews = news.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#0a0c10] text-slate-600 dark:text-slate-400 font-sans transition-colors duration-300">
            <aside className="w-64 bg-white dark:bg-[#11141b] border-r border-gray-200 dark:border-white/5 flex flex-col p-6 gap-6 fixed h-full z-50 shadow-2xl shadow-black/5 dark:shadow-black/50 transition-colors duration-300">
                <div className="flex items-center gap-3 px-2 mb-4">
                    <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <Newspaper className="text-white" size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black tracking-tight uppercase leading-none text-slate-900 dark:text-white italic">Compromiso</h2>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">ADMIN V4.4 - RELEASE</span>
                    </div>
                </div>

                <nav className="flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); resetForms(); }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg'
                                : 'text-slate-500 hover:bg-white/5 hover:text-white border border-transparent'}`}
                        >
                            <item.icon size={18} />
                            <span className="uppercase tracking-widest text-[10px]">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto flex flex-col gap-2">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest">
                        <Globe size={16} /> Web Pública
                    </Link>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-accent-pink/60 hover:text-accent-pink transition-all uppercase tracking-widest">
                        <LogOut size={16} /> Salir
                    </button>
                </div>
            </aside>

            <main className="flex-1 ml-64 p-8 min-h-screen">
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight uppercase italic text-slate-900 dark:text-white leading-none mb-1">
                            {menuItems.find(m => m.id === activeTab).label}
                        </h1>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Gestión integral de la plataforma comercial</p>
                    </div>
                    {activeTab !== 'dashboard' && (
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="size-10 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors hover:shadow-lg"
                                title="Cambiar Tema"
                            >
                                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            {activeTab === 'pharmacies' && (
                                <div className="flex p-1 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                                    <button onClick={() => setPharmacyMode('list')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${pharmacyMode === 'list' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 dark:text-slate-500'}`}>Listado</button>
                                    <button onClick={() => setPharmacyMode('schedule')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${pharmacyMode === 'schedule' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 dark:text-slate-500'}`}>Programar</button>
                                </div>
                            )}
                            <button
                                onClick={() => { setIsAdding(!isAdding); if (isAdding) resetForms(); }}
                                className={`h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${isAdding ? 'bg-slate-800 dark:bg-slate-700 text-white' : 'bg-primary text-white shadow-xl hover:scale-105'}`}
                            >
                                {isAdding ? <X size={14} /> : <Plus size={14} />}
                                {isAdding ? 'Cerrar' : `Añadir Nuevo`}
                            </button>
                        </div>
                    )}
                </header>

                <AnimatePresence mode="wait">
                    {isAdding && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-[#11141b] p-8 rounded-2xl border border-gray-200 dark:border-white/5 mb-10 shadow-2xl overflow-hidden">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
                                {activeTab === 'news' && (
                                    <div className="flex flex-col gap-8">
                                        <div className="flex items-center justify-between bg-white dark:bg-[#0a0c10] p-4 rounded-2xl border border-gray-200 dark:border-white/5">
                                            <div className="flex items-center gap-4">
                                                <button type="button" onClick={() => setPreviewMode(false)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!previewMode ? 'bg-primary text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>Editor</button>
                                                <button type="button" onClick={() => setPreviewMode(true)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${previewMode ? 'bg-primary text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>Previsualizar</button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {aiConfig.enabled && previewMode && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {/* TODO: Implement Enhance Style */ alert("Mejora de estilo próximamente") }}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
                                                    >
                                                        <Sparkles size={14} /> Mejorar Estilo
                                                    </button>
                                                )}
                                                {aiConfig.enabled && !previewMode && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAiModal(true)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
                                                    >
                                                        <Cpu size={14} /> Redactar con IA
                                                    </button>
                                                )}
                                                <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest px-4">Estado: Borrador</span>
                                            </div>
                                        </div>

                                        {!previewMode ? (
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                <div className="flex flex-col gap-6">
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[9px] font-black uppercase text-slate-500 ml-4 mb-2 tracking-widest">Cabecera de Noticia</label>
                                                        <input className="bg-slate-50 dark:bg-[#0a0c10] border border-gray-200 dark:border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-primary shadow-inner" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Título impactante..." required />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-[9px] font-black uppercase text-slate-500 ml-4 mb-2 tracking-widest">Sección</label>
                                                            <select className="bg-[#0a0c10] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-[9px] font-black uppercase text-slate-500 ml-4 mb-2 tracking-widest">Publicación</label>
                                                            <input type="date" className="bg-[#0a0c10] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white font-bold" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[9px] font-black uppercase text-slate-500 ml-4 mb-2 tracking-widest">Imagen de Portada</label>
                                                        <div className="flex gap-2 p-1 bg-[#0a0c10] rounded-2xl border border-white/5">
                                                            {['url', 'pc', 'gallery'].map(src => (
                                                                <button key={src} type="button" onClick={() => {
                                                                    setImageSource(src);
                                                                    if (src === 'gallery') { setGalleryTarget('cover'); setShowGallery(true); }
                                                                }} className={`flex-1 py-3 rounded-xl text-[9px] uppercase font-black transition-all ${imageSource === src ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{src}</button>
                                                            ))}
                                                        </div>
                                                        {imageSource === 'url' && <input className="bg-[#0a0c10] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white mt-2" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="URL de imagen..." />}
                                                        {imageSource === 'pc' && <input type="file" onChange={handleFileUpload} className="mt-2 text-[10px] font-bold text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer" />}
                                                    </div>

                                                    <div className="flex gap-6 p-6 bg-[#0a0c10] rounded-3xl border border-white/5">
                                                        <label className="flex items-center gap-3 cursor-pointer group">
                                                            <div className={`size-5 rounded-md border-2 border-white/10 flex items-center justify-center transition-all ${formData.isHero ? 'bg-primary border-primary' : 'group-hover:border-primary/50'}`}>
                                                                {formData.isHero && <Zap size={12} className="text-white" />}
                                                            </div>
                                                            <input type="checkbox" className="hidden" checked={formData.isHero} onChange={e => setFormData({ ...formData, isHero: e.target.checked })} />
                                                            <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-white transition-colors">Destacar en Portada</span>
                                                        </label>
                                                        <label className="flex items-center gap-3 cursor-pointer group">
                                                            <div className={`size-5 rounded-md border-2 border-white/10 flex items-center justify-center transition-all ${formData.isFlash ? 'bg-accent-pink border-accent-pink' : 'group-hover:border-accent-pink/50'}`}>
                                                                {formData.isFlash && <Zap size={12} className="text-white" />}
                                                            </div>
                                                            <input type="checkbox" className="hidden" checked={formData.isFlash} onChange={e => setFormData({ ...formData, isFlash: e.target.checked })} />
                                                            <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-white transition-colors">Flash Noticia</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-6">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <label className="text-[9px] font-black uppercase text-slate-500 ml-4 tracking-widest">Cuerpo de la Noticia (Bloques)</label>
                                                        <div className="flex gap-2">
                                                            <button type="button" onClick={() => addBlock('text')} className="p-2 bg-white/5 hover:bg-primary/20 text-white rounded-lg transition-colors" title="Añadir Texto"><LayoutDashboard size={14} /></button>
                                                            <button type="button" onClick={() => addBlock('image')} className="p-2 bg-white/5 hover:bg-accent-purple/20 text-white rounded-lg transition-colors" title="Añadir Imagen"><ImageIcon size={14} /></button>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {editorBlocks.map((block, idx) => (
                                                            <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="relative group">
                                                                <div className="absolute -left-3 top-0 bottom-0 w-1 bg-white/5 group-hover:bg-primary/40 rounded-full transition-colors"></div>
                                                                {block.type === 'text' ? (
                                                                    <textarea
                                                                        className="w-full bg-[#0a0c10] border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium text-slate-300 outline-none focus:border-primary min-h-[100px] resize-none leading-relaxed"
                                                                        value={block.content}
                                                                        onChange={e => updateBlock(idx, e.target.value)}
                                                                        placeholder="Escribe el contenido de este párrafo..."
                                                                    />
                                                                ) : (
                                                                    <div className="flex flex-col gap-3 p-4 bg-[#0a0c10] border border-white/5 rounded-2xl">
                                                                        <div className="aspect-video rounded-xl overflow-hidden border border-white/5 bg-black/40 relative group/img">
                                                                            <img src={block.content} className="w-full h-full object-cover" alt="" />
                                                                            <button type="button" onClick={() => { setGalleryTarget(idx); setShowGallery(true); }} className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-black uppercase text-[10px] tracking-widest">
                                                                                <ImageIcon size={16} /> Cambiar Imagen
                                                                            </button>
                                                                        </div>
                                                                        <input className="bg-transparent border-none text-[10px] text-slate-500 outline-none" value={block.content} onChange={e => updateBlock(idx, e.target.value)} placeholder="URL de la imagen..." />
                                                                    </div>
                                                                )}
                                                                <button type="button" onClick={() => removeBlock(idx)} className="absolute -right-3 -top-3 size-8 bg-black/80 text-slate-500 hover:text-accent-pink rounded-full flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </motion.div>
                                                        ))}
                                                    </div>

                                                    <button type="submit" className="mt-4 h-14 bg-gradient-to-r from-primary to-accent-purple text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
                                                        {editingId ? 'Actualizar Crónica' : 'Publicar Noticia'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="max-w-4xl mx-auto w-full bg-[#11141b] rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden text-left">
                                                <div className="relative aspect-video rounded-3xl overflow-hidden mb-8">
                                                    <img src={formData.image || 'https://images.unsplash.com/photo-1504711432869-efd5971ee14b'} className="w-full h-full object-cover" alt="" />
                                                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                                                        {formData.category}
                                                    </div>
                                                </div>
                                                <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-8">
                                                    {formData.title || 'Título de ejemplo'}
                                                </h1>
                                                <div className="flex items-center gap-4 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-10 pb-6 border-b border-white/5">
                                                    <CalendarIcon size={14} className="text-primary" /> {formData.date}
                                                    <div className="flex items-center gap-1 ml-4"><Zap size={14} className="text-primary" /> {formData.author}</div>
                                                </div>
                                                <div className="flex flex-col gap-8">
                                                    {editorBlocks.map((block, i) => (
                                                        block.type === 'text' ? (
                                                            <p key={i} className="text-lg text-slate-300 leading-relaxed font-medium">{block.content || 'Escribe contenido para verlo aquí...'}</p>
                                                        ) : (
                                                            <div key={i} className="flex flex-col gap-3">
                                                                <img src={block.content} className="w-full rounded-[2rem] shadow-2xl border border-white/5" alt="" />
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'pharmacies' && (
                                    <>
                                        <div className="flex flex-col gap-5">
                                            <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nombre Farmacia..." required />
                                            <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white outline-none" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Dirección..." required />
                                        </div>
                                        <div className="flex flex-col gap-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white outline-none" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Teléfono..." />
                                                <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white outline-none" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="Ciudad..." />
                                            </div>
                                            <button type="submit" className="h-12 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Guardar Establecimiento</button>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'categories' && (
                                    <>
                                        <div className="flex flex-col gap-5">
                                            <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white outline-none focus:border-primary" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nombre de la categoría..." required />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-4 py-3 text-sm text-white" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} placeholder="Color (css class o hex)..." />
                                                <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-4 py-3 text-sm text-white" value={formData.bgImage} onChange={e => setFormData({ ...formData, bgImage: e.target.value })} placeholder="URL Imagen de fondo..." />
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-end">
                                            <button type="submit" className="h-12 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Guardar Categoría</button>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'ads' && (
                                    <>
                                        <div className="flex flex-col gap-5">
                                            <select className="bg-[#0a0c10] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white outline-none" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                                <option value="premium">Premium (Header)</option>
                                                <option value="horizontal">Horizontal (Body)</option>
                                                <option value="square">Cuadrada (Sidebar)</option>
                                            </select>
                                            <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-4 py-3 text-sm text-white" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="URL de la imagen..." required />
                                            <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-4 py-3 text-sm text-white" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="Link de destino..." />
                                        </div>
                                        <div className="flex flex-col gap-5">
                                            <label className="flex items-center gap-2 cursor-pointer mt-4">
                                                <input type="checkbox" checked={formData.active} onChange={e => setFormData({ ...formData, active: e.target.checked })} className="size-4 accent-primary" />
                                                <span className="text-[10px] font-black uppercase text-slate-500">Publicidad Activa</span>
                                            </label>
                                            <button type="submit" className="h-12 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Guardar Publicidad</button>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'tickers' && (
                                    <>
                                        <div className="flex flex-col gap-5">
                                            <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white outline-none" value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} placeholder="Mensaje del ticker..." required />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-4 py-3 text-sm text-white" value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })} placeholder="Etiqueta (ej: URGENTE)..." />
                                                <select className="bg-[#0a0c10] border border-white/5 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                                    <option value="alert">Alerta (Rojo)</option>
                                                    <option value="ad">Publicidad (Azul)</option>
                                                    <option value="score">Deporte (Verde)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-end">
                                            <button type="submit" className="h-12 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Guardar Ticker</button>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'cover' && (
                                    <>
                                        <div className="flex flex-col gap-5">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[9px] font-black uppercase text-slate-500 ml-4 mb-2 tracking-widest">Imagen de la Tapa</label>
                                                <div className="flex gap-2 p-1 bg-[#0a0c10] rounded-2xl border border-white/5">
                                                    {['url', 'pc', 'gallery'].map(src => (
                                                        <button key={src} type="button" onClick={() => {
                                                            setImageSource(src);
                                                            if (src === 'gallery') { setGalleryTarget('cover'); setShowGallery(true); }
                                                        }} className={`flex-1 py-3 rounded-xl text-[9px] uppercase font-black transition-all ${imageSource === src ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{src}</button>
                                                    ))}
                                                </div>
                                                {imageSource === 'url' && <input className="bg-[#0a0c10] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white mt-2" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="URL de la tapa digital..." />}
                                                {imageSource === 'pc' && <input type="file" onChange={handleFileUpload} className="mt-2 text-[10px] font-bold text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer" />}
                                            </div>
                                            <label className="text-[9px] font-black uppercase text-slate-500 ml-4 mb-2 tracking-widest">Fecha de Portada</label>
                                            <input type="date" className="bg-[#0a0c10] border border-white/5 rounded-xl px-4 py-3 text-sm text-white font-bold" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                        </div>
                                        <div className="flex flex-col justify-end mt-4">
                                            <button type="submit" className="h-12 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Actualizar Tapa</button>
                                        </div>
                                    </>
                                )}

                                {/* Fallback for other tabs */}
                                {!['news', 'pharmacies', 'categories', 'ads', 'tickers', 'cover'].includes(activeTab) && (
                                    <div className="col-span-2 text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                        <Zap size={32} className="mx-auto text-primary/40 mb-3" />
                                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Configuración para {activeTab}</p>
                                        <button type="submit" className="mt-4 px-8 py-3 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Confirmar Acción</button>
                                    </div>
                                )}
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col gap-6">
                    {/* Dashboard View */}
                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Noticias', value: news.length, icon: Newspaper, color: 'text-primary' },
                                { label: 'Farmacias', value: pharmacies.length, icon: Crosshair, color: 'text-accent-pink' },
                                { label: 'Tapa Diaria', value: coverPage.date, icon: LayoutDashboard, color: 'text-primary' },
                                { label: 'Guardia Hoy', value: onDutyToday?.name || '---', icon: CalendarIcon, color: 'text-accent-purple' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-[#11141b] p-6 rounded-2xl border border-white/5 shadow-xl select-none group hover:border-primary/20 transition-all">
                                    <div className={`size-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color} mb-4 group-hover:scale-110 transition-transform`}><stat.icon size={20} /></div>
                                    <h3 className="text-xl font-black text-white italic truncate">{stat.value}</h3>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pharmacy Specific Logic */}
                    {activeTab === 'pharmacies' && (
                        <div className="flex flex-col gap-6">
                            {pharmacyMode === 'list' ? (
                                <>
                                    <div className="flex flex-wrap items-center gap-4 bg-[#11141b] px-6 py-4 rounded-xl border border-white/5">
                                        <div className="relative flex-1 min-w-[200px]">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                            <input className="w-full bg-[#0a0c10] border border-white/5 rounded-xl pl-12 pr-6 py-3 text-sm font-bold text-white outline-none" placeholder={`Buscar farmacia...`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {pharmacies.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(phi => (
                                            <div key={phi.id} className="bg-[#11141b] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500"><Crosshair size={20} /></div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEdit(phi)} className="p-2 text-slate-600 hover:text-white"><Edit3 size={16} /></button>
                                                        <button onClick={() => deletePharmacy(phi.id)} className="p-2 text-slate-600 hover:text-accent-pink"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                                <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mb-4">{phi.name}</h4>
                                                <div className="text-[10px] text-slate-500 font-bold flex flex-col gap-2 mb-6">
                                                    <span className="flex items-center gap-2"><MapPin size={14} className="text-primary/50" /> {phi.address}</span>
                                                    <span className="flex items-center gap-2"><Phone size={14} className="text-primary/50" /> {phi.phone}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-1 flex flex-col gap-6">
                                        <div className="bg-[#11141b] p-6 rounded-2xl border border-primary/20 bg-primary/5">
                                            <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-4">Programador Automático</h4>
                                            <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-6">Selecciona una fecha y asigna el establecimiento que estará de turno ese día.</p>

                                            {/* Calendar Component */}
                                            <div className="bg-[#0a0c10] border border-white/5 rounded-2xl p-4 mb-4">
                                                {/* Calendar Header */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <button
                                                        onClick={() => {
                                                            const newMonth = new Date(currentMonth);
                                                            newMonth.setMonth(newMonth.getMonth() - 1);
                                                            setCurrentMonth(newMonth);
                                                        }}
                                                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                                    >
                                                        <ChevronLeft size={16} className="text-slate-400" />
                                                    </button>
                                                    <span className="text-xs font-black uppercase text-white tracking-widest">
                                                        {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            const newMonth = new Date(currentMonth);
                                                            newMonth.setMonth(newMonth.getMonth() + 1);
                                                            setCurrentMonth(newMonth);
                                                        }}
                                                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                                    >
                                                        <ChevronRight size={16} className="text-slate-400" />
                                                    </button>
                                                </div>

                                                {/* Days of Week */}
                                                <div className="grid grid-cols-7 gap-1 mb-2">
                                                    {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                                                        <div key={i} className="text-center text-[9px] font-black text-slate-600 uppercase py-1">
                                                            {day}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Calendar Days */}
                                                <div className="grid grid-cols-7 gap-1">
                                                    {(() => {
                                                        const year = currentMonth.getFullYear();
                                                        const month = currentMonth.getMonth();
                                                        const firstDay = new Date(year, month, 1).getDay();
                                                        const daysInMonth = new Date(year, month + 1, 0).getDate();
                                                        const days = [];

                                                        // Empty cells for days before month starts
                                                        for (let i = 0; i < firstDay; i++) {
                                                            days.push(<div key={`empty-${i}`} className="aspect-square" />);
                                                        }

                                                        // Actual days
                                                        for (let day = 1; day <= daysInMonth; day++) {
                                                            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                            const isSelected = dateStr === displayDate;
                                                            const hasAssignment = pharmacyDuty.some(d => d.date === dateStr);
                                                            const isToday = dateStr === new Date().toISOString().split('T')[0];

                                                            days.push(
                                                                <button
                                                                    key={day}
                                                                    onClick={() => setDisplayDate(dateStr)}
                                                                    className={`aspect-square rounded-lg text-[10px] font-bold transition-all relative ${isSelected
                                                                        ? 'bg-primary text-white shadow-lg scale-110'
                                                                        : hasAssignment
                                                                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                                                            : 'text-slate-400 hover:bg-white/5'
                                                                        } ${isToday ? 'ring-1 ring-primary/50' : ''}`}
                                                                >
                                                                    {day}
                                                                    {hasAssignment && !isSelected && (
                                                                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
                                                                    )}
                                                                </button>
                                                            );
                                                        }

                                                        return days;
                                                    })()}
                                                </div>

                                                {/* Selected Date Display */}
                                                <div className="mt-4 pt-4 border-t border-white/5">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Fecha Seleccionada</span>
                                                        <span className="text-xs font-black text-primary">
                                                            {new Date(displayDate + 'T00:00:00').toLocaleDateString('es-ES', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                                                {pharmacies.map(phi => (
                                                    <button
                                                        key={phi.id}
                                                        onClick={() => setDuty(displayDate, phi.id)}
                                                        className={`w-full text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pharmacyDuty.find(d => d.date === displayDate && d.pharmacyId === phi.id) ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                                                    >
                                                        {phi.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-2">
                                        <div className="bg-[#11141b] rounded-2xl border border-white/5 overflow-hidden">
                                            <div className="bg-white/5 px-8 py-5 border-b border-white/5 flex items-center justify-between">
                                                <h4 className="text-[10px] font-black uppercase text-white tracking-[0.2em]">Calendario de Turnos</h4>
                                                <Zap size={14} className="text-yellow-500" />
                                            </div>
                                            <div className="p-2">
                                                {upcomingDuties.length > 0 ? (
                                                    <table className="w-full text-left">
                                                        <tbody className="divide-y divide-white/5">
                                                            {upcomingDuties.map((duty, idx) => (
                                                                <tr key={idx} className="group hover:bg-white/[0.02]">
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <CalendarIcon size={14} className="text-primary" />
                                                                            <span className="text-[11px] font-black text-white italic">{duty.date}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{duty.pharmacy?.name}</span>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-right">
                                                                        <button onClick={() => setDuty(duty.date, null)} className="p-2 text-slate-600 hover:text-accent-pink"><X size={14} /></button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <div className="py-20 text-center">
                                                        <Clock size={32} className="mx-auto text-slate-800 mb-4" />
                                                        <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">No hay turnos programados a futuro</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'ads' && (
                        <div className="flex flex-col gap-10">
                            {/* Hero Ads - 3 Specific Slots */}
                            <div>
                                <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                                    <View size={14} className="text-purple-500" /> Publicidad Portada (3 Espacios)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(num => {
                                        const adType = `hero_${num}`;
                                        const existingAd = ads.find(a => a.type === adType);
                                        return (
                                            <div key={num} className="relative group">
                                                <div className="aspect-[4/3] bg-[#1a1d26] rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative overflow-hidden transition-colors hover:border-purple-500/50">
                                                    {existingAd?.image ? (
                                                        <>
                                                            <img src={existingAd.image} className="w-full h-full object-cover" alt="" />
                                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        if (confirm('¿Eliminar este anuncio?')) {
                                                                            if (existingAd.id) deleteAd(existingAd.id);
                                                                        }
                                                                    }}
                                                                    className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingId(existingAd.id);
                                                                        setFormData({ ...existingAd });
                                                                        setIsAdding(true);
                                                                    }}
                                                                    className="p-2 bg-white/10 text-white rounded-lg hover:bg-white hover:text-black"
                                                                >
                                                                    <Edit3 size={16} />
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-center p-4">
                                                            <span className="block text-2xl font-black text-white/20 mb-2">{num}</span>
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Espacio Vacío</p>
                                                            <button
                                                                onClick={() => {
                                                                    setFormData({ ...formData, type: adType, active: true });
                                                                    setIsAdding(true);
                                                                }}
                                                                className="mt-2 px-3 py-1 bg-purple-500/20 text-purple-500 rounded-lg text-[9px] font-black uppercase hover:bg-purple-500 hover:text-white transition-colors"
                                                            >
                                                                Crear
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-center text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-widest">Espacio {num}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Premium Header Ads */}
                            <div>
                                <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                                    <Star size={14} className="text-yellow-500" /> Publicidad Premium (Cabecera)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {ads.filter(a => a.type === 'premium').map(ad => (
                                        <div key={ad.id} className="bg-[#11141b] group relative overflow-hidden rounded-2xl border border-white/10 hover:border-primary/50 transition-colors">
                                            <div className="h-32 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${ad.image})` }}></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 flex flex-col justify-end">
                                                <span className="text-[10px] font-black uppercase text-white tracking-widest">{ad.active ? '🟢 Activa' : '🔴 Inactiva'}</span>
                                                <p className="text-xs font-bold text-slate-300 truncate">{ad.link}</p>
                                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(ad)} className="p-2 bg-white/10 text-white rounded-lg hover:bg-white hover:text-black"><Edit3 size={14} /></button>
                                                    <button onClick={() => deleteAd(ad.id)} className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => { setFormData({ ...formData, type: 'premium', active: true }); setIsAdding(true); }} className="h-32 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:border-white/20 transition-all text-slate-500 hover:text-white">
                                        <Plus size={24} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Nueva Premium</span>
                                    </button>
                                </div>
                            </div>

                            {/* Horizontal Body Ads */}
                            <div>
                                <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                                    <LayoutDashboard size={14} className="text-blue-400" /> Publicidad Horizontal (Entre contenido)
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {ads.filter(a => a.type === 'horizontal').map(ad => (
                                        <div key={ad.id} className="relative group bg-[#11141b] rounded-2xl border border-white/10 p-1 flex items-center hover:border-blue-400/50 transition-all">
                                            <img src={ad.image} className="w-32 h-20 object-cover rounded-xl" alt="" />
                                            <div className="flex-1 px-4">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[10px] font-black uppercase text-white tracking-widest">{ad.active ? '🟢 Activa' : '🔴 Inactiva'}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 truncate max-w-md">{ad.link}</p>
                                            </div>
                                            <div className="flex gap-2 mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(ad)} className="p-2 bg-white/10 text-white rounded-lg hover:bg-white hover:text-black"><Edit3 size={14} /></button>
                                                <button onClick={() => deleteAd(ad.id)} className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => { setFormData({ ...formData, type: 'horizontal', active: true }); setIsAdding(true); }} className="w-full py-4 rounded-xl border border-dashed border-white/10 flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/20 transition-all text-slate-500 hover:text-white">
                                        <Plus size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Añadir Tira Horizontal</span>
                                    </button>
                                </div>
                            </div>

                            {/* Sidebar Ads */}
                            <div>
                                <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                                    <Grid size={14} className="text-accent-pink" /> Publicidad Cuadrada (Lateral)
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {ads.filter(a => a.type === 'square').map(ad => (
                                        <div key={ad.id} className="aspect-square bg-[#11141b] group relative overflow-hidden rounded-2xl border border-white/10 hover:border-accent-pink/50 transition-colors">
                                            <img src={ad.image} className="w-full h-full object-cover opacity-60" alt="" />
                                            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3">
                                                <span className="text-[9px] font-black uppercase text-white tracking-widest">{ad.active ? '🟢' : '🔴'}</span>
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                                                <button onClick={() => handleEdit(ad)} className="p-2 bg-white text-black rounded-lg"><Edit3 size={16} /></button>
                                                <button onClick={() => deleteAd(ad.id)} className="p-2 bg-red-500 text-white rounded-lg"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => { setFormData({ ...formData, type: 'square', active: true }); setIsAdding(true); }} className="aspect-square rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:border-white/20 transition-all text-slate-500 hover:text-white">
                                        <Plus size={24} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Nueva</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Categories Reorder View */}
                    {activeTab === 'categories' && (
                        <div className="bg-white dark:bg-[#11141b] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-2xl">
                            <div className="px-8 py-5 flex items-center justify-between border-b border-gray-200 dark:border-white/5 bg-slate-50 dark:bg-[#14171d]">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-600">Categorías (Arrastrar para ordenar)</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-600 text-right">Acciones</span>
                            </div>
                            <Reorder.Group axis="y" values={categories} onReorder={reorderCategories} className="divide-y divide-gray-200 dark:divide-white/5 list-none m-0 p-0">
                                {categories.map(cat => (
                                    <Reorder.Item key={cat.id} value={cat} className="flex items-center justify-between px-8 py-6 hover:bg-slate-50 dark:hover:bg-white/[0.02] cursor-grab active:cursor-grabbing bg-white dark:bg-[#11141b] group relative">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                                <Grid size={16} />
                                            </div>
                                            {cat.bg_image && <img src={cat.bg_image} className="size-10 rounded-lg object-cover border border-gray-200 dark:border-white/10" alt="" />}
                                            <div className="flex flex-col">
                                                <span className="font-black text-sm text-slate-900 dark:text-white uppercase italic tracking-tighter">{cat.name}</span>
                                                <span className="text-[9px] font-bold" style={{ color: cat.color }}>{cat.color}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-all">
                                            <button onClick={() => handleEdit(cat)} className="p-2 text-slate-600 hover:text-white"><Edit3 size={16} /></button>
                                            <button onClick={() => deleteCategory(cat.id)} className="p-2 text-slate-600 hover:text-accent-pink"><Trash2 size={16} /></button>
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        </div>
                    )}

                    {/* Gallery Tab */}
                    {activeTab === 'gallery' && (
                        <div className="flex flex-col gap-8">
                            {/* Mass Upload Area */}
                            <div
                                className="bg-white dark:bg-[#11141b] rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 p-10 flex flex-col items-center justify-center gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer relative"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleGalleryUpload}
                                    accept="image/*"
                                />
                                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Upload size={32} className="text-primary" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-slate-900 dark:text-white font-black text-lg uppercase italic tracking-tighter">Subir Imágenes Masivamente</h3>
                                    <p className="text-slate-500 font-bold text-xs mt-1">Arrastra tus archivos aquí o haz clic para explorar</p>
                                </div>
                            </div>

                            {/* Gallery Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {imageGallery.map((img, idx) => (
                                    <div key={idx} className="aspect-square bg-white dark:bg-[#11141b] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden relative group">
                                        <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(img);
                                                    alert('URL copiada al portapapeles');
                                                }}
                                                className="px-3 py-1.5 bg-white text-slate-900 rounded-full text-[10px] font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all w-full"
                                            >
                                                Copiar URL
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm('¿Eliminar imagen?')) deleteFromGallery(img);
                                                }}
                                                className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all border border-red-500/50"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-sm p-2 transform translate-y-full group-hover:translate-y-0 transition-transform delay-75">
                                            <p className="text-[8px] text-slate-400 font-mono truncate">{img.length > 30 ? 'Imagen ' + (idx + 1) : img}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Generic Table View (for News, Ads, etc.) */}
                    {activeTab !== 'pharmacies' && activeTab !== 'dashboard' && activeTab !== 'settings' && activeTab !== 'categories' && activeTab !== 'gallery' && (
                        <div className="bg-white dark:bg-[#11141b] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-[#14171d]">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-600 border-b border-gray-200 dark:border-white/5">Detalles</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-600 border-b border-gray-200 dark:border-white/5">Config</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-600 border-b border-gray-200 dark:border-white/5">Aciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                    {(activeTab === 'news' ? filteredNews :
                                        activeTab === 'scores' ? scores :
                                            activeTab === 'ads' ? ads :
                                                activeTab === 'videos' ? videos :
                                                    activeTab === 'categories' ? categories :
                                                        flashTickers).map(item => (
                                                            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                                                <td className="px-8 py-6">
                                                                    <div className="flex items-center gap-4">
                                                                        {item.image && <img src={item.image} className="size-12 rounded-xl object-cover border border-gray-200 dark:border-white/10" alt="" />}
                                                                        <div className="flex flex-col">
                                                                            <span className="font-black text-sm text-slate-900 dark:text-white uppercase italic tracking-tighter leading-tight group-hover:text-primary transition-colors">{item.title || item.name || item.text || 'Sin título'}</span>
                                                                            <div className="flex gap-2 items-center mt-1">
                                                                                <span className="text-[9px] text-slate-500 dark:text-slate-600 uppercase font-black tracking-widest">{item.category || item.tag || 'Editorial'}</span>
                                                                                {item.isFlash && <span className="text-[7px] bg-accent-pink/20 text-accent-pink px-1.5 py-0.5 rounded font-black tracking-widest">FLASH</span>}
                                                                                {item.isHero && <span className="text-[7px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded font-black tracking-widest">PORTADA</span>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-6">
                                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.date || item.time || 'Activado'}</span>
                                                                </td>
                                                                <td className="px-8 py-6 text-right">
                                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                                        <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-slate-900 dark:text-slate-600 dark:hover:text-white"><Edit3 size={16} /></button>
                                                                        <button onClick={() => {
                                                                            if (activeTab === 'news') deleteNews(item.id);
                                                                            if (activeTab === 'ads') deleteAd(item.id);
                                                                            if (activeTab === 'videos') deleteVideo(item.id);
                                                                            if (activeTab === 'categories') deleteCategory(item.id);
                                                                            if (activeTab === 'tickers') deleteTicker(item.id);
                                                                            if (activeTab === 'scores') setScores(s => s.filter(x => x.id !== item.id));
                                                                        }} className="p-2 text-slate-600 hover:text-accent-pink"><Trash2 size={16} /></button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="bg-[#11141b] p-8 rounded-2xl border border-white/5 shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <section className="p-6 bg-[#0a0c10] rounded-2xl border border-white/5">
                                    <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Layers size={14} className="text-primary" /> Edición del Diario
                                    </h3>
                                    <p className="text-[10px] text-slate-500 font-bold mb-6">Gestiona el número de edición que se muestra en la cabecera. Se incrementará automáticamente cada día.</p>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => updateEdition(parseInt(editionNumber) - 1)}
                                            className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                                        >-</button>
                                        <div className="flex-1 bg-[#11141b] border border-white/10 rounded-xl px-4 py-3 text-lg font-black text-center text-primary italic">
                                            {editionNumber}
                                        </div>
                                        <button
                                            onClick={() => updateEdition(parseInt(editionNumber) + 1)}
                                            className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                                        >+</button>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-white/5">
                                        <button
                                            onClick={() => fetch('/api/cron-increment').then(() => alert('Script ejecutado.'))}
                                            className="w-full py-3 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                                        >
                                            Forzar Incremento Diario
                                        </button>
                                    </div>
                                </section>

                                <section className="p-6 bg-slate-50 dark:bg-[#0a0c10] rounded-2xl border border-gray-200 dark:border-white/5">
                                    <h3 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Cpu size={14} className="text-emerald-500" /> Inteligencia Artificial
                                    </h3>
                                    <p className="text-[10px] text-slate-500 font-bold mb-6">Conecta un modelo (Gemini/OpenAI) para redacción automática de noticias y sugerencias de formato.</p>

                                    <div className="flex flex-col gap-4">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" checked={aiConfig.enabled} onChange={e => updateAiConfig({ ...aiConfig, enabled: e.target.checked })} className="size-4 accent-emerald-500" />
                                            <span className="text-[10px] font-black uppercase text-slate-400">Habilitar Asistente IA</span>
                                        </label>

                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-600 ml-1">API Key</label>
                                                {aiConfig.apiKey && <span className="text-[8px] font-bold text-emerald-500">Guardado</span>}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="password"
                                                    className="flex-1 bg-white dark:bg-[#11141b] border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 shadow-inner"
                                                    placeholder="Pegar API Key aquí..."
                                                    defaultValue={aiConfig.apiKey}
                                                    onBlur={(e) => updateAiConfig({ ...aiConfig, apiKey: e.target.value })}
                                                />
                                            </div>
                                            <p className="text-[8px] text-slate-600 ml-1">Se guarda automáticamente al salir del campo.</p>
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] font-black uppercase text-slate-600 ml-1">Modelo Seleccionado</label>
                                            <select
                                                className="bg-[#11141b] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none font-bold"
                                                value={aiConfig.model}
                                                onChange={e => updateAiConfig({ ...aiConfig, model: e.target.value })}
                                            >
                                                <option value="llama3-70b-8192">Groq - Llama 3 70B (Recomendado)</option>
                                                <option value="mixtral-8x7b-32768">Groq - Mixtral 8x7b</option>
                                                <option value="gemma-7b-it">Groq - Gemma 7B</option>
                                                <option value="gemini-1.5-flash">Google Gemini 1.5 Flash</option>
                                                <option value="gemini-1.5-pro">Google Gemini 1.5 Pro</option>
                                                <option value="gpt-4o">OpenAI GPT-4o</option>
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                <section className="p-6 bg-slate-50 dark:bg-[#0a0c10] rounded-2xl border border-gray-200 dark:border-white/5 opacity-50">
                                    <h3 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Wand2 size={14} className="text-accent-pink" /> Generación Automática
                                    </h3>
                                    <p className="text-[10px] text-slate-500 font-bold mb-6">Próximamente: Diseña portadas completas y diagramación de notas con un solo clic.</p>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="w-1/2 h-full bg-primary/40 animate-pulse"></div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}

                </div >
            </main >

            <AnimatePresence>
                {showGallery && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowGallery(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-[#11141b] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
                                <div>
                                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Galería de Medios</h2>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Selecciona una imagen almacenada</p>
                                </div>
                                <button onClick={() => setShowGallery(false)} className="size-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                                {imageGallery.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            if (galleryTarget === 'cover') {
                                                setFormData({ ...formData, image: img });
                                            } else {
                                                updateBlock(galleryTarget, img);
                                            }
                                            setShowGallery(false);
                                        }}
                                        className="aspect-square rounded-2xl overflow-hidden border border-white/5 cursor-pointer group relative"
                                    >
                                        <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                                        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="px-4 py-2 bg-white text-primary rounded-xl font-black text-[9px] uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform">Seleccionar</div>
                                        </div>
                                    </div>
                                ))}
                                {imageGallery.length === 0 && (
                                    <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
                                        <ImageIcon size={48} className="text-slate-800" />
                                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">La galería está vacía</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-[#0a0c10] border-t border-white/5 flex justify-end">
                                <button onClick={() => setShowGallery(false)} className="px-8 py-3 bg-white/5 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Cerrar Galería</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAiModal && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAiModal(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-[#11141b] rounded-[2.5rem] border border-white/10 shadow-2xl p-8 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-white flex items-center gap-2 uppercase italic tracking-tighter"><Cpu size={24} className="text-emerald-500" /> Asistente de Redacción</h3>
                                <button onClick={() => setShowAiModal(false)} className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10"><X size={16} /></button>
                            </div>
                            <p className="text-xs text-slate-400 font-bold leading-relaxed">Pega el cable de noticias, un enlace o tus apuntes. La IA generará el título, la categoría y el cuerpo de la noticia con el formato correcto.</p>

                            <textarea
                                className="w-full h-40 bg-[#0a0c10] border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-emerald-500/50 resize-none font-medium"
                                placeholder="Ej: Hubo un accidente en la ruta 2..."
                                value={aiPrompt}
                                onChange={e => setAiPrompt(e.target.value)}
                            ></textarea>

                            <button
                                onClick={async () => {
                                    setIsGenerating(true);
                                    try {
                                        const res = await fetch('/api/generate-news', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ prompt: aiPrompt })
                                        });
                                        if (res.ok) {
                                            const data = await res.json();
                                            // Auto-fill form
                                            if (data.title) setFormData(prev => ({ ...prev, title: data.title }));
                                            if (data.category && categories.some(c => c.name === data.category)) setFormData(prev => ({ ...prev, category: data.category }));
                                            if (data.blocks) setEditorBlocks(data.blocks);
                                            setShowAiModal(false);
                                            setAiPrompt('');
                                        } else {
                                            alert('Error al generar. Verifica tu API Key.');
                                        }
                                    } catch (e) {
                                        console.error(e);
                                        alert('Error de conexión.');
                                    } finally {
                                        setIsGenerating(false);
                                    }
                                }}
                                disabled={isGenerating || !aiPrompt.trim()}
                                className="h-12 w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {isGenerating ? <><div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generando...</> : <><Wand2 size={16} /> Generar Noticia</>}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default Admin;
