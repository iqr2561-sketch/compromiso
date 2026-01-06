import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, Calendar, ArrowRight, Zap } from 'lucide-react';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { news } = useNews();
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (query.trim()) {
            const filtered = news.filter(item => {
                const titleMatch = item.title.toLowerCase().includes(query.toLowerCase());
                const categoryMatch = item.category.toLowerCase().includes(query.toLowerCase());

                let contentMatch = false;
                try {
                    const blocks = JSON.parse(item.content);
                    if (Array.isArray(blocks)) {
                        contentMatch = blocks.some(b =>
                            b.type === 'text' && b.content.toLowerCase().includes(query.toLowerCase())
                        );
                    } else {
                        contentMatch = item.content?.toLowerCase().includes(query.toLowerCase());
                    }
                } catch (e) {
                    contentMatch = item.content?.toLowerCase().includes(query.toLowerCase());
                }

                return titleMatch || categoryMatch || contentMatch;
            });
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query, news]);

    return (
        <div className="flex flex-col gap-10 py-10">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <SearchIcon size={24} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
                            Resultados <span className="text-primary italic">de Búsqueda</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mt-2">
                            Buscando: <span className="text-primary">"{query}"</span> — {results.length} coincidencias
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <AnimatePresence mode="wait">
                        {results.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col gap-6"
                            >
                                {results.map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group bg-white dark:bg-surface-dark rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 hover:shadow-2xl transition-all cursor-pointer flex flex-col md:flex-row shadow-xl shadow-black/5"
                                    >
                                        <Link to={`/noticia/${item.id}`} className="flex flex-col md:flex-row w-full">
                                            <div className="md:w-[240px] h-[180px] md:h-full overflow-hidden shrink-0">
                                                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.title} />
                                            </div>
                                            <div className="p-6 flex flex-col gap-3 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-2 py-1 bg-slate-100 dark:bg-white/5 text-[8px] font-black text-slate-500 dark:text-slate-400 rounded uppercase tracking-widest">{item.category}</span>
                                                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                                        <Calendar size={12} className="text-primary" /> {item.date}
                                                    </div>
                                                </div>
                                                <h2 className="text-xl font-black text-slate-900 dark:text-white leading-[1.1] group-hover:text-primary transition-colors tracking-tighter uppercase italic line-clamp-2">
                                                    {item.title}
                                                </h2>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                                                    {(() => {
                                                        try {
                                                            const blocks = JSON.parse(item.content);
                                                            if (Array.isArray(blocks)) {
                                                                return blocks.find(b => b.type === 'text')?.content || "Sin descripción disponible.";
                                                            }
                                                        } catch (e) { }
                                                        return item.content || "Sin descripción disponible.";
                                                    })()}
                                                </p>
                                                <div className="flex items-center justify-between border-t border-gray-50 dark:border-white/5 pt-3 mt-1">
                                                    <span className="text-[9px] font-black italic tracking-widest text-primary uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                                        Leer más <ArrowRight size={14} />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-24 text-center gap-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10"
                            >
                                <Zap size={48} className="text-slate-300 dark:text-slate-800" />
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Sin coincidencias</h3>
                                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No encontramos noticias que coincidan con tu búsqueda.</p>
                                </div>
                                <div className="flex gap-4">
                                    <Link to="/" className="px-8 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">Ir al Inicio</Link>
                                    <button onClick={() => window.history.back()} className="px-8 py-3 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Volver</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <aside className="lg:col-span-4 flex flex-col gap-8">
                    <div className="bg-slate-900 dark:bg-surface-dark rounded-[2.5rem] p-8 text-white border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 size-32 bg-primary/20 blur-[60px] rounded-full translate-x-10 -translate-y-10"></div>
                        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-6 relative z-10">Sugerencias</h4>
                        <div className="flex flex-col gap-4 relative z-10">
                            {['Locales', 'Provinciales', 'Nacionales'].map(tag => (
                                <Link
                                    key={tag}
                                    to={`/search?q=${tag}`}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5"
                                >
                                    <span className="text-xs font-black uppercase italic">{tag}</span>
                                    <ArrowRight size={14} className="text-primary" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Search;
