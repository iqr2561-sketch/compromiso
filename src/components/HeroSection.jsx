import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNews } from '../context/NewsContext';
import { ChevronLeft, ChevronRight, Trophy, PlayCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    const { news, scores } = useNews();
    const [currentIndex, setCurrentIndex] = useState(0);
    const heroNewsList = news.filter(n => n.isHero || n.category.includes('Tech'));
    const sidebarNews = news.filter(n => !n.isHero && !n.isFlash && !n.category.includes('Tech')).slice(0, 2);

    useEffect(() => {
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
                    {heroNews && (
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
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-sm text-white font-black uppercase tracking-widest bg-primary/20 px-3 py-1 rounded-md border border-primary/30">Por {heroNews.author || 'Redacción'}</span>
                                        <span className="text-xs text-gray-400 font-bold">• {heroNews.timeRead || '3 min'} de lectura</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

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
                            className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-white/30'}`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Sidebar with News and Scores */}
            <div className="lg:col-span-4 flex flex-col gap-4">
                {/* Lateral News */}
                <div className="grid grid-cols-1 gap-4 flex-1">
                    {sidebarNews.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * (idx + 1) }}
                            className="relative min-h-[180px] rounded-3xl overflow-hidden group cursor-pointer bg-surface-darker border border-white/5"
                        >
                            <Link to={`/noticia/${item.id}`} className="absolute inset-0 block">
                                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 text-pretty">
                                    <div className="flex justify-between items-start">
                                        <span className={`${item.isLive ? 'text-accent-pink' : 'text-accent-green'} text-[10px] font-bold uppercase tracking-widest flex items-center gap-1`}>
                                            {item.isLive && <span className="w-1.5 h-1.5 rounded-full bg-accent-pink animate-pulse"></span>}
                                            {item.category}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className={`text-lg md:text-xl font-bold text-white group-hover:text-primary transition-colors leading-tight`}>
                                            {item.title}
                                        </h3>
                                        <span className="text-[10px] text-gray-400 font-medium">{item.date}</span>
                                    </div>
                                </div>
                                <div
                                    className="absolute inset-0 opacity-40 group-hover:opacity-20 transition-opacity bg-cover bg-center"
                                    style={{ backgroundImage: `url(${item.image})` }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent"></div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Local Scores Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface-dark flex flex-col rounded-3xl border border-white/5 overflow-hidden shadow-xl"
                >
                    <div className="bg-slate-900/50 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Trophy size={16} className="text-yellow-500" />
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Resultados Locales</h4>
                        </div>
                        <span className="text-[9px] font-bold text-accent-green bg-accent-green/10 px-2 py-0.5 rounded-full animate-pulse">EN VIVO</span>
                    </div>
                    <div className="p-2 flex flex-col gap-2">
                        {scores.map(score => (
                            <div key={score.id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="flex flex-col items-center gap-1 flex-1">
                                        <img src={score.homeLogo} alt={score.home} className="size-6 rounded-full group-hover:scale-110 transition-transform" />
                                        <span className="text-[9px] font-bold text-slate-400 group-hover:text-white transition-colors">{score.home}</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center px-4 py-1 bg-black/30 rounded-xl">
                                        <span className="text-lg font-black text-white italic">{score.homeScore} - {score.awayScore}</span>
                                        <span className="text-[8px] font-bold text-primary tracking-widest uppercase">{score.time}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 flex-1">
                                        <img src={score.awayLogo} alt={score.away} className="size-6 rounded-full group-hover:scale-110 transition-transform" />
                                        <span className="text-[9px] font-bold text-slate-400 group-hover:text-white transition-colors">{score.away}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link to="/categoria/Deportes" className="w-full py-3 bg-white/5 hover:bg-white/10 text-[10px] font-bold text-slate-500 hover:text-white transition-all uppercase tracking-widest text-center">
                        Ver todos los resultados
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
