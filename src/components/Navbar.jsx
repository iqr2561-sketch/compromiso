import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Newspaper, Search, Menu, X, Settings, ChevronDown, ExternalLink

} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNews } from '../context/NewsContext';

const Navbar = () => {
    const { categories, menuOrder } = useNews();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, link: null });
    const location = useLocation();
    const navigate = useNavigate();

    // Close context menu on click outside
    useEffect(() => {
        const handleClick = () => setContextMenu({ visible: false, x: 0, y: 0, link: null });
        if (contextMenu.visible) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [contextMenu.visible]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleContextMenu = (e, link) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            link: link
        });
    };

    const openInNewTab = () => {
        if (contextMenu.link) {
            window.open(contextMenu.link.path, '_blank');
        }
        setContextMenu({ visible: false, x: 0, y: 0, link: null });
    };

    const openInNewWindow = () => {
        if (contextMenu.link) {
            window.open(contextMenu.link.path, '_blank', 'width=1200,height=800');
        }
        setContextMenu({ visible: false, x: 0, y: 0, link: null });
    };

    // Excluded categories from main menu
    const excludedCategories = [
        '¿Te Acordás Dolores?', 'Te Acordás Dolores', 'TE ACORDÁS DOLORES???', 'Memoria', 'Tapa del día'
    ];

    // Helper to build hierarchy
    const buildMenu = () => {
        // 1. Get parents
        let parents = categories
            .filter(c =>
                !c.parent_id &&
                !excludedCategories.includes(c.name) &&
                !c.name.toUpperCase().includes('TE ACORDÁS DOLORES')
            );

        // 2. Sort by menuOrder if available, otherwise by default priority
        if (menuOrder && menuOrder.length > 0) {
            parents = parents.sort((a, b) => {
                const idxA = menuOrder.indexOf(a.name);
                const idxB = menuOrder.indexOf(b.name);
                // Items not in menuOrder go to the end
                const posA = idxA === -1 ? 999 : idxA;
                const posB = idxB === -1 ? 999 : idxB;
                return posA - posB;
            });
        } else {
            parents = parents.sort((a, b) => {
                const priority = { 'Locales': 1, 'Deportes': 2, 'Actualidad': 3 };
                const pA = priority[a.name] || 99;
                const pB = priority[b.name] || 99;
                return pA - pB;
            });
        }

        // 3. Map parents to menu items with children
        return [
            { name: 'Inicio', path: '/' },
            ...parents.map(parent => {
                const children = categories.filter(c => c.parent_id === parent.id);

                return {
                    name: parent.name,
                    path: `/categoria/${parent.name}`,
                    submenu: children.length > 0 ? children.map(child => ({
                        name: child.name,
                        path: `/categoria/${parent.name}/${child.name}`
                    })) : null
                };
            })
        ];
    };

    const navLinks = buildMenu();

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <>
            <header className="sticky top-0 z-[1000] w-full flex flex-col shadow-xl shadow-black/5">
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

                        <nav className="hidden lg:flex items-center gap-1 bg-surface-dark/5 dark:bg-white/5 p-1 rounded-full border border-gray-200 dark:border-white/10">
                            {navLinks.map((link) => (
                                <div key={link.name} className="relative group shrink-0">
                                    <Link
                                        to={link.path}
                                        onContextMenu={(e) => handleContextMenu(e, link)}
                                        className={`px-3 py-1.5 text-[11px] lg:text-xs font-black tracking-wide rounded-full transition-all flex items-center gap-1.5 ${link.name === 'Tapa del día' ? 'normal-case' : 'uppercase'} ${isActive(link.path)
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-white dark:hover:bg-white/5'
                                            }`}
                                    >
                                        {link.icon && <link.icon size={12} />}
                                        {link.name === '¿Te Acordás Dolores?' ? 'Memoria' : link.name}
                                        {link.submenu && <ChevronDown size={12} className="opacity-70" />}
                                    </Link>

                                    {link.submenu && (
                                        <div className="absolute top-full left-0 pt-3 w-56 hidden group-hover:block z-[1001]">
                                            <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden p-1.5 ring-1 ring-black/5">
                                                {link.submenu.map((subLink) => (
                                                    <Link
                                                        key={subLink.name}
                                                        to={subLink.path}
                                                        onContextMenu={(e) => handleContextMenu(e, subLink)}
                                                        className="block px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white rounded-lg transition-colors"
                                                    >
                                                        {subLink.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2">
                            <Link to="/admin" className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300" title="Admin Panel">
                                <Settings size={20} />
                            </Link>

                            <div className="relative flex items-center">
                                <AnimatePresence>
                                    {isSearchOpen && (
                                        <motion.form
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 200, opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            onSubmit={handleSearch}
                                            className="absolute right-0 top-0 h-10 overflow-hidden z-10"
                                        >
                                            <input
                                                autoFocus
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Buscar historias..."
                                                className="w-full h-full pr-12 pl-4 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-bold outline-none border border-gray-200 dark:border-white/10 focus:border-primary transition-all"
                                            />
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                                <button
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className={`relative z-20 flex items-center justify-center size-10 rounded-full transition-colors ${isSearchOpen ? 'text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                                >
                                    {isSearchOpen ? <X size={20} /> : <Search size={20} />}
                                </button>
                            </div>


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
                            <div className="flex flex-col p-4 gap-2 h-[calc(100vh-80px)] overflow-y-auto">
                                {navLinks.map((link) => (
                                    <div key={link.name}>
                                        <Link
                                            to={link.path}
                                            onClick={() => !link.submenu && setIsMenuOpen(false)}
                                            onContextMenu={(e) => handleContextMenu(e, link)}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors ${isActive(link.path) && !link.submenu ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {link.icon && <link.icon size={16} />}
                                                {link.name}
                                            </div>
                                            {link.submenu && <ChevronDown size={16} />}
                                        </Link>
                                        {link.submenu && (
                                            <div className="ml-4 pl-4 border-l border-gray-200 dark:border-white/10 mt-1 space-y-1">
                                                {link.submenu.map((subLink) => (
                                                    <Link
                                                        key={subLink.name}
                                                        to={subLink.path}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        onContextMenu={(e) => handleContextMenu(e, subLink)}
                                                        className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white"
                                                    >
                                                        {subLink.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Custom Context Menu */}
            <AnimatePresence>
                {contextMenu.visible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed z-[2000] bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden py-1 min-w-[200px]"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                    >
                        <button
                            onClick={openInNewTab}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <ExternalLink size={16} className="text-primary" />
                            Abrir en nueva pestaña
                        </button>
                        <button
                            onClick={openInNewWindow}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <ExternalLink size={16} className="text-slate-400" />
                            Abrir en nueva ventana
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;

