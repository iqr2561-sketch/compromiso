import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNews } from '../context/NewsContext';
import { ChevronLeft, ChevronRight, Trophy, PlayCircle, Star, LayoutDashboard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    const { news, scores, coverPage } = useNews();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Improved logic: Heroes are the ones specifically marked as such
    const heroNewsList = news.filter(n => n.isHero).slice(0, 10);
    // Sidebar news: any news that is NOT a hero, OR if there aren't enough, just the rest of the news
    const otherNews = news.filter(n => !n.isHero && !n.isFlash);
    const sidebarNews = otherNews.length >= 2 ? otherNews.slice(0, 2) : news.filter(n => !n.isFlash && !heroNewsList.slice(0, 1).includes(n)).slice(1, 3);

    useEffect(() => {
        if (heroNewsList.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroNewsList.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroNewsList.length]);

    const heroNews = heroNewsList[currentIndex];

    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto">
            {/* Main Hero Carousel */}
            <div className="lg:col-span-8 relative rounded-3xl overflow-hidden group shadow-2xl shadow-black/20 bg-slate-900 min-h-[400px] lg:h-[600px]">
                <AnimatePresence mode="wait">
                    {heroNews ? (
                        <motion.div
                            key={heroNews.id}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0"
                        >
                            <Link to={`/noticia/${heroNews.id}`}>
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${heroNews.image})` }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col items-start gap-4 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/20 backdrop-blur-sm">
                                            {heroNews.category}
                                        </span>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star size={12} className="fill-yellow-500" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Destacado</span>
                                        </div>
                                    </div>
                                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                                        {heroNews.title}
                                    </h1>
                                    <p className="text-gray-300 text-sm md:text-lg max-w-2xl line-clamp-2 md:line-clamp-3 font-light">
                                        {heroNews.content}
                                    </p>
                                    {/* Removed by user request */}
                                </div>
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/20 font-black uppercase tracking-widest">Cargando Portada...</div>
                    )}
                </AnimatePresence>

                {heroNewsList.length > 1 && (
                    <>
                        <div className="absolute bottom-6 right-6 flex gap-2 z-20">
                            <button
                                onClick={() => setCurrentIndex((prev) => (prev - 1 + heroNewsList.length) % heroNewsList.length)}
                                className="size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => setCurrentIndex((prev) => (prev + 1) % heroNewsList.length)}
                                className="size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <div className="absolute top-6 right-6 flex gap-1 z-20">
                            {heroNewsList.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1 transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-white/30'} rounded-full`}
                                ></div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Sidebar with News and Scores */}
            <div className="lg:col-span-4 flex flex-col gap-4">
                {/* Lateral News - RESTORED and Corrected */}
                <div className="grid grid-cols-1 gap-4 flex-1">
                    {sidebarNews.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * (idx + 1) }}
                            className="relative min-h-[160px] rounded-3xl overflow-hidden group cursor-pointer bg-surface-dark border border-white/5 shadow-xl"
                        >
                            <Link to={`/noticia/${item.id}`} className="absolute inset-0 block">
                                <div
                                    className="absolute inset-0 opacity-40 group-hover:opacity-20 transition-opacity bg-cover bg-center"
                                    style={{ backgroundImage: `url(${item.image})` }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-primary text-[9px] font-black uppercase tracking-widest mb-1">
                                            {item.category}
                                        </span>
                                        <h3 className={`text-lg font-black text-white group-hover:text-primary transition-colors leading-tight uppercase italic tracking-tighter`}>
                                            {item.title}
                                        </h3>
                                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">{item.date}</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Cover Page Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-surface-dark flex flex-col rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl group cursor-pointer"
                >
                    <Link to="/tapa-de-hoy" className="flex flex-col h-full">
                        <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <LayoutDashboard size={16} className="text-primary" />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Tapa de Portada</h4>
                            </div>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{coverPage.date}</span>
                        </div>
                        <div className="relative flex-1 bg-black/5 overflow-hidden">
                            <img
                                src={coverPage.image}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 aspect-[3/4]"
                                alt="Tapa del día"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                <p className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    Ver edición de hoy <ArrowRight size={14} />
                                </p>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </section >
    );
};

export default HeroSection;
