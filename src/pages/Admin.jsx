import React, { useState, useRef, useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import {
    Plus, Trash2, Edit3, Save, X, Image as ImageIcon, Zap, Trophy,
    Newspaper, LayoutDashboard, Settings, Video,
    LogOut, BarChart3, Users, Bell, Layers, Megaphone, Search, Filter,
    Upload, Globe, Grid, Crosshair, Calendar as CalendarIcon, MapPin, Phone, ArrowRight,
    ChevronLeft, ChevronRight, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Admin = () => {
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
        editionNumber, updateEdition
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const actions = {
            news: () => editingId ? updateNews(editingId, formData) : addNews(formData),
            tickers: () => editingId ? updateTicker(editingId, { text: formData.text, tag: formData.tag, type: formData.type }) : addTicker({ text: formData.text, tag: formData.tag, type: formData.type }),
            categories: () => editingId ? updateCategory(editingId, { name: formData.name, color: formData.color, bgImage: formData.bgImage }) : addCategory({ name: formData.name, color: formData.color, bgImage: formData.bgImage }),
            ads: () => editingId ? updateAd(editingId, formData) : addAd(formData),
            videos: () => editingId ? updateVideo(editingId, formData) : addVideo(formData),
            pharmacies: () => editingId ? updatePharmacy(editingId, formData) : addPharmacy(formData),
            scores: () => {
                const sData = { home: formData.home, away: formData.away, homeScore: formData.homeScore, awayScore: formData.awayScore, homeLogo: formData.homeLogo, awayLogo: formData.awayLogo, time: formData.time, date: formData.date };
                editingId ? setScores(prev => prev.map(s => s.id === editingId ? { ...s, ...sData } : s)) : setScores(prev => [...prev, { ...sData, id: Date.now() }]);
            }
        };

        if (actions[activeTab]) actions[activeTab]();
        resetForms();
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
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({ ...formData, ...item, name: item.name || item.title || '', text: item.text || item.title || '' });
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

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'news', label: 'Noticias', icon: Newspaper },
        { id: 'pharmacies', label: 'Farmacias', icon: Crosshair },
        { id: 'ads', label: 'Publicidad', icon: Megaphone },
        { id: 'videos', label: 'Videos', icon: Video },
        { id: 'categories', label: 'Categorías', icon: Layers },
        { id: 'scores', label: 'Resultados', icon: Trophy },
        { id: 'tickers', label: 'Flash Tickers', icon: Zap },
        { id: 'settings', label: 'Configuración', icon: Settings },
    ];

    const upcomingDuties = pharmacyDuty
        .filter(d => d.date >= new Date().toISOString().split('T')[0])
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(d => ({ ...d, pharmacy: pharmacies.find(p => p.id === d.pharmacyId) }));

    const onDutyToday = pharmacies.find(p => p.id === pharmacyDuty.find(d => d.date === displayDate)?.pharmacyId);

    // Filter display news based on search and category
    const filteredNews = news.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-[#0a0c10] text-slate-400 font-sans">
            <aside className="w-64 bg-[#11141b] border-r border-white/5 flex flex-col p-6 gap-6 fixed h-full z-50 shadow-2xl shadow-black/50">
                <div className="flex items-center gap-3 px-2 mb-4">
                    <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <Newspaper className="text-white" size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black tracking-tight uppercase leading-none text-white italic">Compromiso</h2>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">ADMIN V4.1</span>
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
                        <h1 className="text-3xl font-black tracking-tight uppercase italic text-white leading-none mb-1">
                            {menuItems.find(m => m.id === activeTab).label}
                        </h1>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Gestión integral de la plataforma comercial</p>
                    </div>
                    {activeTab !== 'dashboard' && (
                        <div className="flex gap-4">
                            {activeTab === 'pharmacies' && (
                                <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                                    <button onClick={() => setPharmacyMode('list')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${pharmacyMode === 'list' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'}`}>Listado</button>
                                    <button onClick={() => setPharmacyMode('schedule')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${pharmacyMode === 'schedule' ? 'bg-primary text-white shadow-lg' : 'text-slate-500'}`}>Programar</button>
                                </div>
                            )}
                            <button
                                onClick={() => { setIsAdding(!isAdding); if (isAdding) resetForms(); }}
                                className={`h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${isAdding ? 'bg-slate-800 text-white' : 'bg-primary text-white shadow-xl hover:scale-105'}`}
                            >
                                {isAdding ? <X size={14} /> : <Plus size={14} />}
                                {isAdding ? 'Cerrar' : `Añadir Nuevo`}
                            </button>
                        </div>
                    )}
                </header>

                <AnimatePresence mode="wait">
                    {isAdding && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-[#11141b] p-8 rounded-2xl border border-white/5 mb-10 shadow-2xl">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {activeTab === 'news' && (
                                    <>
                                        <div className="flex flex-col gap-5">
                                            <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white outline-none focus:border-primary" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Título de la noticia..." required />
                                            <div className="grid grid-cols-2 gap-4">
                                                <select className="bg-[#0a0c10] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                                </select>
                                                <input type="date" className="bg-[#0a0c10] border border-white/5 rounded-xl px-4 py-3 text-sm text-white" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                            </div>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" checked={formData.isHero} onChange={e => setFormData({ ...formData, isHero: e.target.checked })} className="size-4 accent-primary" />
                                                    <span className="text-[10px] font-black uppercase text-slate-500">Destacada Portada</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" checked={formData.isFlash} onChange={e => setFormData({ ...formData, isFlash: e.target.checked })} className="size-4 accent-primary" />
                                                    <span className="text-[10px] font-black uppercase text-slate-500">Noticia Flash</span>
                                                </label>
                                            </div>
                                            <div className="flex gap-1 p-1 bg-[#0a0c10] rounded-xl border border-white/5">
                                                {['url', 'pc', 'gallery'].map(src => (
                                                    <button key={src} type="button" onClick={() => {
                                                        setImageSource(src);
                                                        if (src === 'gallery') setShowGallery(true);
                                                    }} className={`flex-1 py-2 rounded-lg text-[9px] uppercase font-black transition-all ${imageSource === src ? 'bg-primary text-white' : 'text-slate-500'}`}>{src}</button>
                                                ))}
                                            </div>
                                            {imageSource === 'url' && <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-4 py-3 text-sm text-white" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="URL de imagen..." />}
                                            {imageSource === 'pc' && <input type="file" onChange={handleFileUpload} className="text-xs" />}
                                        </div>
                                        <div className="flex flex-col gap-5">
                                            <textarea className="bg-[#0a0c10] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white outline-none h-32 resize-none" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} placeholder="Cuerpo de la noticia..." />
                                            <button type="submit" className="h-12 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">Guardar Publicación</button>
                                        </div>
                                    </>
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

                                {/* Fallback for other tabs */}
                                {!['news', 'pharmacies', 'categories', 'ads', 'tickers'].includes(activeTab) && (
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
                                { label: 'Resultados', value: scores.length, icon: Trophy, color: 'text-accent-orange' },
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

                    {/* Generic Table View (for News, Ads, etc.) */}
                    {activeTab !== 'pharmacies' && activeTab !== 'dashboard' && activeTab !== 'settings' && (
                        <div className="bg-[#11141b] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead className="bg-[#14171d]">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-600 border-b border-white/5">Detalles</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-600 border-b border-white/5">Config</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-600 border-b border-white/5">Aciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {(activeTab === 'news' ? filteredNews :
                                        activeTab === 'scores' ? scores :
                                            activeTab === 'ads' ? ads :
                                                activeTab === 'videos' ? videos :
                                                    activeTab === 'categories' ? categories :
                                                        flashTickers).map(item => (
                                                            <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                                                <td className="px-8 py-6">
                                                                    <div className="flex items-center gap-4">
                                                                        {item.image && <img src={item.image} className="size-12 rounded-xl object-cover border border-white/10" alt="" />}
                                                                        <div className="flex flex-col">
                                                                            <span className="font-black text-sm text-white uppercase italic tracking-tighter leading-tight group-hover:text-primary transition-colors">{item.title || item.name || item.text || 'Sin título'}</span>
                                                                            <div className="flex gap-2 items-center mt-1">
                                                                                <span className="text-[9px] text-slate-600 uppercase font-black tracking-widest">{item.category || item.tag || 'Editorial'}</span>
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
                                                                        <button onClick={() => handleEdit(item)} className="p-2 text-slate-600 hover:text-white"><Edit3 size={16} /></button>
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

                                <section className="p-6 bg-[#0a0c10] rounded-2xl border border-white/5 opacity-50">
                                    <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Bell size={14} className="text-accent-pink" /> Notificaciones
                                    </h3>
                                    <p className="text-[10px] text-slate-500 font-bold mb-6">Próximamente: Configura el envío de alertas y noticias flash a los suscriptores.</p>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="w-1/3 h-full bg-emerald-500"></div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}

                </div>
            </main>

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
                                            setFormData({ ...formData, image: img });
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
        </div>
    );
};

export default Admin;
