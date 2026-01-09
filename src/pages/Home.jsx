import React from 'react';
import HeroSection from '../components/HeroSection';
import FlashNews from '../components/FlashNews';
import CategoryGrid from '../components/CategoryGrid';

import Newsletter from '../components/Newsletter';
import AdSection from '../components/AdSection';
import { motion } from 'framer-motion';
import { History, TrendingUp, Star, Bell, ArrowUpRight } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const { news, footerSettings } = useNews();

    // Select specific news for the Quick Stats row
    const trendingNews = news.find(n => n.category.includes('Tech')) || news[0];
    const exclusiveNews = news.find(n => n.category.includes('Actualidad')) || news[1];
    const alertNews = news.find(n => n.category.includes('Deportes')) || news[2];

    const quickStats = [
        { label: 'Tendencia del día', item: trendingNews, icon: <TrendingUp size={18} className="text-primary" />, color: 'primary' },
        { label: 'Exclusivo Locales', item: exclusiveNews, icon: <Star size={18} className="text-yellow-500" />, color: 'yellow' },
        { label: 'Última Alerta', item: alertNews, icon: <Bell size={18} className="text-accent-pink" />, color: 'pink' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-14"
        >
            <HeroSection />

            {/* Quick Stats / Trending Row - Connected to Context */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickStats.map((stat, i) => (
                    <Link to={`/noticia/${stat.item?.id}`} key={i} className="bg-white dark:bg-surface-dark p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 flex items-center gap-4 hover:shadow-2xl transition-all shadow-lg shadow-black/5 cursor-pointer group relative overflow-hidden">
                        <div className="size-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                            {stat.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary transition-colors">{stat.label}</span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{stat.item?.title || 'Cargando...'}</h4>
                        </div>
                        <ArrowUpRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </Link>
                ))}
            </div>

            {/* Premium Ad below Hero */}
            <AdSection type="premium" className="shadow-2xl shadow-primary/5" />

            <FlashNews />
            {/* Grid of ads for diversity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 flex flex-col gap-8">
                    <CategoryGrid />


                    <div className="relative group">
                        <Link to="/categoria/¿Te Acordás Dolores?" className="block relative h-64 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20">
                            <img
                                src={footerSettings.te_acordas_bg}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter sepia-[0.3]"
                                alt="Memoria Histórica"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
                            <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-primary/20 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                                        <History className="text-primary" size={20} />
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] drop-shadow-lg">
                                        Memoria Histórica
                                    </span>
                                </div>
                                <div className="px-8 py-4 bg-white text-primary text-[10px] font-black uppercase tracking-widest rounded-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-2xl flex items-center gap-3">
                                    Explorar Archivo <ArrowUpRight size={18} />
                                </div>
                            </div>
                        </Link>
                    </div>


                </div>
                <div className="flex flex-col gap-6">
                    <AdSection type="sidebar_1" className="h-52 w-full" />
                    <AdSection type="sidebar_2" className="h-52 w-full" />
                    <AdSection type="sidebar_3" className="h-52 w-full" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AdSection type="footer_1" className="h-32" />
                <AdSection type="footer_2" className="h-32" />
            </div>

            <Newsletter />

            {/* Legacy Version Button */}
            <div className="flex justify-center py-10">
                <a
                    href="/legacy.html"
                    className="flex items-center gap-4 px-10 py-5 rounded-full bg-slate-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-slate-500 hover:text-primary dark:hover:text-white transition-all hover:shadow-2xl group shadow-lg"
                >
                    <History size={20} className="group-hover:rotate-[-45deg] transition-transform" />
                    <span className="text-sm font-black uppercase tracking-widest">Ver Edición Clásica del Diario</span>
                </a>
            </div>
        </motion.div>
    );
};

export default Home;
