import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Trophy, Cpu, Zap, MapPin } from 'lucide-react';
import AdSection from '../components/AdSection';

const Category = () => {
    const { categoryName } = useParams();
    const { news, scores, categories } = useNews();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [categoryName]);

    // Find full category object from context
    const currentCategory = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase()) || {
        name: categoryName,
        color: 'primary',
        bgImage: 'https://images.unsplash.com/photo-1504711432869-efd5971ee14b?auto=format&fit=crop&q=80&w=1600'
    };

    // Normalize and filter news - FIXED FILTERING
    const categoryNews = news.filter(n =>
        n.category.toLowerCase().includes(categoryName.toLowerCase()) ||
        categoryName.toLowerCase().includes(n.category.toLowerCase())
    );

    const getStyles = (cat) => {
        const name = cat.toLowerCase();
        if (name.includes('tech')) return { color: 'text-accent-purple', bg: 'bg-accent-purple/10', border: 'border-accent-purple/20', accent: 'from-accent-purple/60', to: 'to-blue-600/60', icon: <Cpu size={24} /> };
        if (name.includes('deportes')) return { color: 'text-accent-orange', bg: 'bg-accent-orange/10', border: 'border-accent-orange/20', accent: 'from-accent-orange/60', to: 'to-red-600/60', icon: <Trophy size={24} /> };
        if (name.includes('viral')) return { color: 'text-accent-pink', bg: 'bg-accent-pink/10', border: 'border-accent-pink/20', accent: 'from-accent-pink/60', to: 'to-purple-600/60', icon: <Zap size={24} /> };
        if (name.includes('actualidad')) return { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', accent: 'from-primary/60', to: 'to-blue-400/60', icon: <MapPin size={24} /> };
        return { color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200', accent: 'from-slate-500/60', to: 'to-slate-400/60', icon: <Zap size={24} /> };
    };

    const styles = getStyles(categoryName);

    return (
        <div className="flex flex-col gap-10">
            {/* Category Header - Balanced size (rounded-3xl instead of 4rem) */}
            <div className={`relative h-64 md:h-80 rounded-3xl overflow-hidden flex items-end p-8 md:p-12 border border-white/5 shadow-2xl shadow-black/20`}>

                {/* Background Layer: Sharp image */}
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${currentCategory.bgImage})` }}
                ></motion.div>

                {/* Diffused Image Layer (User request: "imagen difusa") */}
                <div
                    className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 mix-blend-screen"
                    style={{ backgroundImage: `url(${currentCategory.bgImage})` }}
                ></div>

                {/* Section Color Overlay - Fixed visibility */}
                <div className={`absolute inset-0 bg-gradient-to-br ${styles.accent} ${styles.to} mix-blend-multiply opacity-40`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                <div className="relative z-10 flex flex-col gap-3">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className={`size-12 rounded-xl ${styles.bg} ${styles.color} flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-xl`}
                    >
                        {styles.icon}
                    </motion.div>
                    <div>
                        <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className={`text-[10px] font-black uppercase tracking-[0.4em] ${styles.color} mb-1 block drop-shadow-lg`}
                        >
                            Compromiso Diario • Sección
                        </motion.span>
                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl"
                        >
                            {categoryName}
                        </motion.h1>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 flex flex-col gap-8">
                    {categoryNews.length > 0 ? (
                        categoryNews.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group bg-white dark:bg-surface-dark rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 hover:shadow-2xl transition-all cursor-pointer flex flex-col shadow-xl shadow-black/5"
                            >
                                <Link to={`/noticia/${item.id}`} className="flex flex-col md:flex-row">
                                    <div className="md:w-[300px] h-[250px] md:h-full overflow-hidden relative shrink-0">
                                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.title} />
                                        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-widest bg-black/60 backdrop-blur-md border border-white/10`}>
                                            {item.category}
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col gap-4 flex-1">
                                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-white/5 py-1.5 px-3 rounded-lg border border-gray-100 dark:border-white/5 self-start">
                                            <div className="flex items-center gap-2 italic"><Calendar size={12} className="text-primary" /> {item.date}</div>
                                            <div className="w-px h-3 bg-gray-200 dark:bg-white/10 mx-1"></div>
                                            <div className="flex items-center gap-2 italic"><Clock size={12} className="text-primary" /> {item.timeRead || '5 MIN'}</div>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-[1.1] group-hover:text-primary transition-colors tracking-tighter uppercase italic">
                                            {item.title}
                                        </h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                                            {item.content || "Análisis profundo sobre los eventos que marcan la agenda en la sección de " + categoryName + "."}
                                        </p>
                                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/10 pt-4 mt-2">
                                            <span className="text-[10px] font-black italic tracking-widest text-primary uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                                Leer noticia <ArrowRight size={14} />
                                            </span>
                                            <div className={`size-10 rounded-full ${styles.bg} ${styles.color} flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-lg border border-white/5`}>
                                                <ArrowRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-6 bg-[#111] rounded-3xl border border-white/5 shadow-2xl">
                            <Zap size={40} className="text-primary opacity-20" />
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Próximas crónicas en edición</h3>
                            <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest">Nuestra redacción está validando contenidos para {categoryName}.</p>
                            <Link to="/" className="px-8 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">Volver al Inicio</Link>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 flex flex-col gap-8">
                    {categoryName.toLowerCase().includes('deportes') && (
                        <div className="bg-[#14181f] rounded-3xl p-8 border border-white/5 shadow-2xl">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-3 mb-6">
                                <Trophy size={18} className="text-accent-orange" /> Resultados Directos
                            </h4>
                            <div className="flex flex-col gap-4">
                                {scores.map(s => (
                                    <div key={s.id} className="flex flex-col gap-3 p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/[0.08] transition-all">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col items-center gap-1 flex-1">
                                                <img src={s.homeLogo} className="size-8 rounded-full bg-slate-800 p-1" alt="" />
                                                <span className="text-[9px] font-black uppercase truncate w-20 text-center">{s.home}</span>
                                            </div>
                                            <div className="flex flex-col items-center text-white">
                                                <span className="text-xl font-black italic">{s.homeScore} — {s.awayScore}</span>
                                                <span className="text-[8px] font-black text-primary uppercase tracking-widest leading-none mt-1">{s.time}</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1 flex-1">
                                                <img src={s.awayLogo} className="size-8 rounded-full bg-slate-800 p-1" alt="" />
                                                <span className="text-[9px] font-black uppercase truncate w-20 text-center">{s.away}</span>
                                            </div>
                                        </div>
                                        <div className="text-center pt-2 border-t border-white/5">
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Registrado: {s.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <AdSection type="square" className="rounded-3xl" />

                    <div className="bg-gradient-to-br from-[#14181f] to-[#0a0c10] rounded-3xl p-8 border border-white/5 text-white flex flex-col gap-6 shadow-2xl relative group overflow-hidden">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Crónicas Gold</h4>
                        <div className="flex flex-col gap-8 relative z-10">
                            {[1, 2].map(i => (
                                <div key={i} className="flex gap-4 group cursor-pointer">
                                    <span className="text-4xl font-black text-white/5 group-hover:text-primary transition-colors italic leading-none">0{i}</span>
                                    <div className="flex flex-col gap-1">
                                        <h5 className="text-sm font-black italic leading-tight group-hover:text-primary transition-colors uppercase tracking-widest">Análisis VIP: {categoryName}</h5>
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic group-hover:text-white transition-colors">Lectura 10 min</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Category;
