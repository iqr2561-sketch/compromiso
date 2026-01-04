import React, { useState, useRef } from 'react';
import { useNews } from '../context/NewsContext';
import {
    Plus, Trash2, Edit3, Save, X, Image as ImageIcon, Zap, Trophy,
    Newspaper, LayoutDashboard, Settings, Video,
    LogOut, BarChart3, Users, Bell, Layers, Megaphone, Search, Filter,
    Upload, Globe, Grid, Crosshair, Calendar as CalendarIcon, MapPin, Phone, ArrowRight
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
        pharmacyDuty, setDuty
    } = useNews();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [imageSource, setImageSource] = useState('url');
    const [displayDate, setDisplayDate] = useState(new Date().toISOString().split('T')[0]);

    // Unified Form State (to prevent "lost functionalities")
    const [formData, setFormData] = useState({
        title: '', category: 'Actualidad', image: '', content: '', author: 'Admin', date: new Date().toISOString().split('T')[0],
        text: '', tag: 'DEPORTES', type: 'score',
        home: '', away: '', homeScore: 0, awayScore: 0, homeLogo: '', awayLogo: '', time: 'Finalizado',
        name: '', color: 'primary', bgImage: '',
        link: '', active: true,
        views: '0', duration: '0:00', url: '',
        address: '', phone: '', city: 'Central'
    });

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
            text: '', tag: 'DEPORTES', type: 'score',
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
    ];

    const onDutyToday = pharmacies.find(p => p.id === pharmacyDuty.find(d => d.date === displayDate)?.pharmacyId);

    return (
        <div className="flex min-h-screen bg-[#0a0c10] text-slate-400 font-sans">
            {/* Sidebar - Proportional size */}
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
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Gestión integral de la plataforma editorial</p>
                    </div>
                    {activeTab !== 'dashboard' && (
                        <button
                            onClick={() => { setIsAdding(!isAdding); if (isAdding) resetForms(); }}
                            className={`h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${isAdding ? 'bg-slate-800 text-white' : 'bg-primary text-white shadow-xl hover:scale-105'}`}
                        >
                            {isAdding ? <X size={14} /> : <Plus size={14} />}
                            {isAdding ? 'Cerrar' : `Añadir Nuevo`}
                        </button>
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
                                            <select className="bg-[#0a0c10] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                            </select>
                                            <div className="flex gap-1 p-1 bg-[#0a0c10] rounded-xl border border-white/5">
                                                {['url', 'pc', 'gallery'].map(src => (
                                                    <button key={src} type="button" onClick={() => setImageSource(src)} className={`flex-1 py-2 rounded-lg text-[9px] uppercase font-black transition-all ${imageSource === src ? 'bg-primary text-white' : 'text-slate-500'}`}>{src}</button>
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
                                            <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nombre Categoría..." required />
                                            <select className="bg-[#0a0c10] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })}>
                                                <option value="primary">Primario</option>
                                                <option value="accent-purple">Violeta</option>
                                                <option value="accent-orange">Naranja</option>
                                                <option value="accent-pink">Rosa</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-5">
                                            <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white outline-none" value={formData.bgImage} onChange={e => setFormData({ ...formData, bgImage: e.target.value })} placeholder="URL Fondo Sección..." />
                                            <button type="submit" className="h-12 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Guardar Categoría</button>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'scores' && (
                                    <>
                                        <div className="flex flex-col gap-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-4 py-3 text-sm text-white" value={formData.home} onChange={e => setFormData({ ...formData, home: e.target.value })} placeholder="Local..." />
                                                <input className="bg-[#0a0c10] border border-white/5 rounded-xl px-4 py-3 text-sm text-white" value={formData.away} onChange={e => setFormData({ ...formData, away: e.target.value })} placeholder="Visitante..." />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <input type="number" className="bg-[#0a0c10] border border-white/5 rounded-xl px-4 py-3 text-sm text-white" value={formData.homeScore} onChange={e => setFormData({ ...formData, homeScore: parseInt(e.target.value) })} />
                                                <input type="number" className="bg-[#0a0c10] border border-white/5 rounded-xl px-4 py-3 text-sm text-white" value={formData.awayScore} onChange={e => setFormData({ ...formData, awayScore: parseInt(e.target.value) })} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <input type="date" className="bg-[#0a0c10] border border-white/5 rounded-xl px-4 py-3 text-sm text-white" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                            <button type="submit" className="h-12 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Guardar Marcador</button>
                                        </div>
                                    </>
                                )}

                                {['ads', 'videos', 'tickers'].includes(activeTab) && (
                                    <div className="col-span-2 text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                        <Zap size={32} className="mx-auto text-primary/40 mb-3" />
                                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Configuración básica para {activeTab}</p>
                                        <button type="submit" className="mt-4 px-8 py-3 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Actualizar Datos</button>
                                    </div>
                                )}
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col gap-6">
                    {/* Filters Row */}
                    {activeTab !== 'dashboard' && (activeTab !== 'pharmacies' || searchTerm !== '') && (
                        <div className="flex flex-wrap items-center gap-4 bg-[#11141b] px-6 py-4 rounded-xl border border-white/5">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                <input className="w-full bg-[#0a0c10] border border-white/5 rounded-xl pl-12 pr-6 py-3 text-sm font-bold text-white outline-none focus:border-primary" placeholder={`Buscar...`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                            {activeTab === 'pharmacies' && (
                                <div className="flex items-center gap-3 bg-[#0a0c10] px-4 py-2 rounded-xl border border-white/5">
                                    <span className="text-[9px] font-black text-slate-600 uppercase">Ver Fecha:</span>
                                    <input type="date" className="bg-transparent text-xs font-bold text-white outline-none" value={displayDate} onChange={e => setDisplayDate(e.target.value)} />
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Noticias', value: news.length, icon: Newspaper, color: 'text-primary' },
                                { label: 'Farmacias', value: pharmacies.length, icon: Crosshair, color: 'text-accent-pink' },
                                { label: 'Resultados', value: scores.length, icon: Trophy, color: 'text-accent-orange' },
                                { label: 'Guardia Hoy', value: onDutyToday?.name || '---', icon: CalendarIcon, color: 'text-accent-purple' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-[#11141b] p-6 rounded-2xl border border-white/5 shadow-xl select-none">
                                    <div className={`size-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color} mb-4`}><stat.icon size={20} /></div>
                                    <h3 className="text-xl font-black text-white italic truncate">{stat.value}</h3>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'pharmacies' && (
                        <div className="flex flex-col gap-6">
                            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex items-center justify-between">
                                <div>
                                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-1 block">Guardia seleccionada para {displayDate}</span>
                                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{onDutyToday?.name || 'Vago / Sin Asignar'}</h3>
                                </div>
                                <CalendarIcon className="text-primary/40" size={40} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pharmacies.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(phi => {
                                    const isAssigned = pharmacyDuty.find(d => d.date === displayDate && d.pharmacyId === phi.id);
                                    return (
                                        <div key={phi.id} className={`bg-[#11141b] p-6 rounded-2xl border transition-all ${isAssigned ? 'border-primary shadow-lg shadow-primary/10' : 'border-white/5 hover:border-white/10'}`}>
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`size-10 rounded-xl flex items-center justify-center ${isAssigned ? 'bg-primary text-white' : 'bg-white/5 text-slate-500'}`}><Crosshair size={20} /></div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEdit(phi)} className="p-2 text-slate-600 hover:text-white transition-colors"><Edit3 size={16} /></button>
                                                    <button onClick={() => deletePharmacy(phi.id)} className="p-2 text-slate-600 hover:text-accent-pink transition-colors"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                            <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mb-4">{phi.name}</h4>
                                            <div className="text-[10px] text-slate-500 font-bold flex flex-col gap-2 mb-6">
                                                <span className="flex items-center gap-2"><MapPin size={14} className="text-primary/50" /> {phi.address}</span>
                                                <span className="flex items-center gap-2"><Phone size={14} className="text-primary/50" /> {phi.phone}</span>
                                            </div>
                                            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{phi.city}</span>
                                                {!isAssigned ? (
                                                    <button onClick={() => setDuty(displayDate, phi.id)} className="px-4 py-2 bg-white/5 hover:bg-primary hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">Asignar hoy</button>
                                                ) : (
                                                    <span className="text-[9px] font-black text-primary uppercase flex items-center gap-1"><Zap size={10} /> De Turno</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab !== 'pharmacies' && activeTab !== 'dashboard' && (
                        <div className="bg-[#11141b] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead className="bg-[#14171d]">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-600 border-b border-white/5">Detalles</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-600 border-b border-white/5">Info</th>
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
                                                                            <span className="text-[9px] text-slate-600 uppercase font-black tracking-widest">{item.category || item.tag || 'Editorial'}</span>
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
                                                                            if (activeTab === 'pharmacies') deletePharmacy(item.id);
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
                </div>
            </main>
        </div>
    );
};

export default Admin;
