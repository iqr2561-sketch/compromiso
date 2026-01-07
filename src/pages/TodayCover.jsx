import React, { useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, LayoutDashboard, Share2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const TodayCover = () => {
    const { news, coverPage } = useNews();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Filter relevant news of the day (marked as hero or flash or just the latest ones for that date)
    const dayNews = news.filter(n => n.date === coverPage.date).sort((a, b) => b.isHero - a.isHero);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-12 py-10"
        >
            <div className="max-w-[1440px] mx-auto w-full px-4 lg:px-8">
                <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <LayoutDashboard size={24} />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
                                    Edición <span className="text-primary italic">del Día</span>
                                </h1>
                                <div className="flex items-center gap-2 mt-2">
                                    <Calendar size={14} className="text-primary" />
                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">{coverPage.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="h-12 px-6 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all">
                            <Share2 size={16} /> Compartir Tapa
                        </button>
                        <button className="h-12 px-6 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20">
                            <Download size={16} /> Descargar PDF
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Digital Cover Image */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="sticky top-24 bg-white dark:bg-surface-dark p-4 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5"
                        >
                            <img
                                src={coverPage.image}
                                className="w-full rounded-xl shadow-lg"
                                alt="Tapa del día"
                            />
                        </motion.div>
                    </div>

                    {/* Relevant News List */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-2 rounded-full bg-primary animate-pulse"></div>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Noticias Destacadas</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {dayNews.length > 0 ? dayNews.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative bg-white dark:bg-surface-dark rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 hover:shadow-2xl transition-all cursor-pointer flex flex-col sm:flex-row h-auto sm:h-52 shadow-xl shadow-black/5"
                                >
                                    <Link to={`/noticia/${item.id}`} className="flex flex-col sm:flex-row w-full">
                                        <div className="sm:w-64 h-48 sm:h-full overflow-hidden shrink-0">
                                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.title} />
                                        </div>
                                        <div className="p-8 flex flex-col justify-center gap-3 flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-white/5 text-[8px] font-black text-slate-500 dark:text-slate-400 rounded uppercase tracking-widest">{item.category}</span>
                                                {item.isHero && <span className="flex items-center gap-1 text-[8px] font-black text-primary uppercase tracking-widest"><LayoutDashboard size={10} /> Portada</span>}
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors tracking-tighter uppercase italic line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-[9px] font-black italic tracking-widest text-primary uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                                    Seguir leyendo <ArrowRight size={14} />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )) : (
                                <div className="py-20 text-center bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10">
                                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No hay crónicas destacadas cargadas para esta fecha todavía.</p>
                                </div>
                            )}
                        </div>

                        {/* More News Link */}
                        <div className="mt-8 flex justify-center">
                            <Link to="/" className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                                Ver todas las noticias
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TodayCover;
