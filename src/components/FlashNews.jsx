import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { ChevronLeft, ChevronRight, Zap, ArrowRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const FlashNews = () => {
    const { news } = useNews();
    const flashNews = news.filter(n => n.isFlash);
    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = 4;

    const next = () => {
        setStartIndex((prev) => (prev + 1) % (flashNews.length - visibleCount + 1));
    };

    const prev = () => {
        setStartIndex((prev) => (prev - 1 + (flashNews.length - visibleCount + 1)) % (flashNews.length - visibleCount + 1));
    };

    if (flashNews.length === 0) return null;

    return (
        <div className="flex flex-col gap-8 py-12">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex size-12 rounded-xl bg-[#111] dark:bg-white items-center justify-center text-white dark:text-[#111] shadow-2xl">
                        <Zap size={24} className="fill-current" />
                    </div>
                    <div className="hidden md:block">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase italic">Flash Editorial</h2>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1">Primicias en tiempo real</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={prev} className="size-12 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg active:scale-90">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={next} className="size-12 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg active:scale-90">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout" initial={false}>
                    {flashNews.slice(startIndex, startIndex + visibleCount).map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative h-[400px] rounded-3xl overflow-hidden group border border-white/5 shadow-2xl hover:shadow-primary/5 cursor-pointer"
                        >
                            <Link to={`/noticia/${item.id}`} className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                                {/* Blurred Background Layer */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${item.image})` }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all duration-500"></div>

                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/20 self-start">
                                        {item.category}
                                    </span>
                                    <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2 py-1 rounded-md self-start border border-white/5">
                                        <Clock size={10} className="text-accent-pink" />
                                        <span className="text-[8px] font-black text-white uppercase">{item.date}</span>
                                    </div>
                                </div>

                                <div className="relative z-10 flex flex-col gap-4">
                                    <h3 className="text-xl font-black text-white leading-tight group-hover:text-primary transition-colors italic">
                                        {item.title}
                                    </h3>
                                    <div className="size-10 rounded-full bg-white text-slate-900 flex items-center justify-center self-end group-hover:bg-primary group-hover:text-white transition-all group-hover:translate-x-2 shadow-xl">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </Link>

                            {/* Diffuse background proposal */}
                            <div className="absolute top-0 right-0 size-32 bg-primary/20 blur-[60px] rounded-full translate-x-10 -translate-y-10"></div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FlashNews;
