import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Tv, TrendingUp, Zap, Megaphone } from 'lucide-react';
import { useNews } from '../context/NewsContext';

const TickerBar = () => {
    const { flashTickers } = useNews();
    const [currentIndex, setCurrentIndex] = useState(0);

    const getIcon = (type) => {
        switch (type) {
            case 'score': return <Trophy size={14} />;
            case 'market': return <TrendingUp size={14} />;
            case 'ad': return <Megaphone size={14} />;
            default: return <Zap size={14} />;
        }
    };

    const getColor = (tag) => {
        if (tag.includes('DEPORTES')) return 'bg-accent-orange';
        if (tag.includes('MERCADOS')) return 'bg-accent-green';
        if (tag.includes('PUBLICIDAD')) return 'bg-primary';
        return 'bg-accent-pink';
    };

    useEffect(() => {
        if (flashTickers.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % flashTickers.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [flashTickers.length]);

    if (flashTickers.length === 0) return null;

    const currentItem = flashTickers[currentIndex];

    return (
        <div className="w-full bg-slate-100 dark:bg-surface-dark border-b border-gray-200 dark:border-white/5 overflow-hidden">
            <div className="max-w-[1440px] mx-auto h-12 flex items-center px-4 lg:px-8">
                <div className="flex items-center gap-2 mr-6 shrink-0">
                    <div className="size-6 rounded-lg bg-primary flex items-center justify-center text-white">
                        <Zap size={14} className="fill-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">FLASH NEWS</span>
                </div>

                <div className="relative flex-1 h-full flex items-center pointer-events-none overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center gap-3 w-full"
                        >
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black text-white ${getColor(currentItem.tag)}`}>
                                {currentItem.tag}
                            </span>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <span className="opacity-70">{getIcon(currentItem.type)}</span>
                                <span className={`text-sm font-bold tracking-tight line-clamp-1 italic ${currentItem.type === 'ad' ? 'text-primary dark:text-primary transition-colors' : ''}`}>
                                    {currentItem.text}
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="hidden md:ml-6 md:flex items-center gap-4 shrink-0 border-l border-gray-200 dark:border-white/10 pl-6">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="size-6 rounded-full border-2 border-white dark:border-surface-dark bg-slate-300 overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?u=${i + 14}`} alt="user" />
                            </div>
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter cursor-pointer hover:text-primary transition-colors">+12k personas leyendo</span>
                </div>
            </div>
        </div>
    );
};

export default TickerBar;
