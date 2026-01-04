import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Newspaper, Search, Menu, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Actualidad', path: '/categoria/Actualidad' },
        { name: 'Tech', path: '/categoria/Tech' },
        { name: 'Deportes', path: '/categoria/Deportes' },
        { name: 'Viral', path: '/categoria/Viral' },
        { name: 'Admin', path: '/admin', icon: Settings },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full flex flex-col shadow-xl shadow-black/5">
            <div className="w-full backdrop-blur-md bg-white/80 dark:bg-[#111318]/90 border-b border-gray-200 dark:border-[#282e39]">
                <div className="px-4 lg:px-8 max-w-[1440px] mx-auto h-16 md:h-20 flex items-center justify-between gap-4">
                    <Link to="/" className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center size-9 md:size-10 rounded-xl bg-gradient-to-br from-primary to-accent-purple shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                            <Newspaper className="text-white" size={24} />
                        </div>
                        <h1 className="text-base sm:text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                            Diario <span className="text-primary">Compromiso</span>
                        </h1>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-1 bg-surface-dark/5 dark:bg-white/5 p-1.5 rounded-full border border-gray-200 dark:border-white/10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-4 py-2 text-sm font-bold rounded-full transition-all flex items-center gap-2 ${isActive(link.path)
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl'
                                    : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white'
                                    }`}
                            >
                                {link.icon && <link.icon size={14} />}
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300">
                            <Search size={20} />
                        </button>
                        <button className="hidden sm:flex h-10 px-6 items-center justify-center rounded-full bg-primary text-white text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20">
                            Suscríbete
                        </button>
                        <button
                            className="lg:hidden flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white dark:bg-background-dark border-b border-gray-200 dark:border-white/10"
                    >
                        <div className="flex flex-col p-4 gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`px-4 py-3 rounded-xl font-bold transition-colors ${isActive(link.path) ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
