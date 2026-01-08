import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNews } from '../context/NewsContext';
import { ChevronLeft, ChevronRight, Trophy, PlayCircle, Star, LayoutDashboard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdSection from './AdSection';

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
            <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Main Hero Carousel */}
                <div className="relative rounded-3xl overflow-hidden group shadow-2xl shadow-black/20 bg-slate-900 min-h-[400px] lg:h-[600px]">
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
                                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                                            {heroNews.title}
                                        </h1>
                                        <p className="text-gray-300 text-sm md:text-lg max-w-2xl line-clamp-2 md:line-clamp-3 font-light">
                                            {(() => {
                                                try {
                                                    if (heroNews.content.startsWith('[')) {
                                                        const blocks = JSON.parse(heroNews.content);
                                                        const textBlock = blocks.find(b => b.type === 'text');
                                                        return textBlock ? textBlock.content : '';
                                                    }
                                                    return heroNews.content;
                                                } catch (e) {
                                                    return heroNews.content;
                                                }
                                            })()}
                                        </p>
                                        {/* Removed by user request */}
                                    </div>
                                </Link>
                            </motion.div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-white/20 font-black uppercase tracking-widest">Cargando Portada...</div>
                        )}
                    </AnimatePresence>

                    {/* Bottom 3 News Strip */}
                    <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-md border-t border-white/10 p-4 z-30 hidden md:grid grid-cols-3 divide-x divide-white/10">
                        {otherNews.slice(0, 3).map((item, i) => (
                            <Link to={`/noticia/${item.id}`} key={item.id} className="px-4 flex flex-col gap-1 group/item hover:bg-white/5 transition-colors rounded-lg py-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">{item.category}</span>
                                    <span className="text-[8px] text-gray-500 font-bold">{item.time_read || '2 min'}</span>
                                </div>
                                <h4 className="text-xs font-semibold text-white leading-tight line-clamp-2 group-hover/item:text-primary transition-colors">
                                    {item.title}
                                </h4>
                            </Link>
                        ))}
                    </div>

                    {heroNewsList.length > 1 && (
                        <>
                            {/* Navigation Buttons - Adjusted position */}
                            <div className="absolute bottom-32 right-6 flex gap-2 z-20">
                                <button
                                    onClick={(e) => { e.preventDefault(); setCurrentIndex((prev) => (prev - 1 + heroNewsList.length) % heroNewsList.length); }}
                                    className="size-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all shadow-lg"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); setCurrentIndex((prev) => (prev + 1) % heroNewsList.length); }}
                                    className="size-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all shadow-lg"
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
                {/* Hero Ads Section - 3 Columns */}
                <div className="grid grid-cols-3 gap-4">
                    <AdSection type="hero_1" className="!aspect-video h-auto !p-0 !rounded-xl" />
                    <AdSection type="hero_2" className="!aspect-video h-auto !p-0 !rounded-xl" />
                    <AdSection type="hero_3" className="!aspect-video h-auto !p-0 !rounded-xl" />
                </div>
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
                                        <span className="text-primary text-[9px] font-bold uppercase tracking-widest mb-1">
                                            {item.category}
                                        </span>
                                        <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors leading-snug">
                                            {item.title}
                                        </h3>
                                        <span className="text-[9px] text-gray-500 font-medium mt-1">{item.date}</span>
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
