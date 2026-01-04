import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { Link } from 'react-router-dom';

const CategoryGrid = () => {
    const { news } = useNews();

    const categories = [
        { name: 'Actualidad', color: 'bg-primary', accent: 'text-primary' },
        { name: 'Tech', color: 'bg-accent-purple', accent: 'text-accent-purple' },
        { name: 'Deportes', color: 'bg-accent-orange', accent: 'text-accent-orange' },
        { name: 'Viral', color: 'bg-accent-pink', accent: 'text-accent-pink' },
    ];

    const getNewsByCategory = (cat) => {
        return news.filter(n => n.category.toLowerCase().includes(cat.toLowerCase()) && !n.isHero).slice(0, 3);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {categories.map((cat) => (
                <section key={cat.name} className="flex flex-col gap-6" id={cat.name.toLowerCase()}>
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                            <span className={`w-2.5 h-8 rounded-full ${cat.color} shadow-lg shadow-black/10`}></span>
                            <h2 className="text-2xl font-black tracking-tighter uppercase italic">
                                {cat.name}
                            </h2>
                        </div>
                        <Link
                            className={`text-[10px] font-black uppercase tracking-widest ${cat.accent} flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all`}
                            to={`/categoria/${cat.name}`}
                        >
                            Ver Todo
                            <ArrowRight size={12} />
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        {getNewsByCategory(cat.name).map((item) => (
                            <Link
                                to={`/categoria/${cat.name}`}
                                key={item.id}
                                className="bg-white dark:bg-surface-darker rounded-[2rem] p-5 flex gap-5 hover:shadow-2xl transition-all border border-gray-100 dark:border-white/5 cursor-pointer group shadow-lg shadow-black/5"
                            >
                                <div
                                    className="w-24 h-24 shrink-0 rounded-2xl bg-cover bg-center overflow-hidden border border-white/5 shadow-inner"
                                    style={{ backgroundImage: `url(${item.image})` }}
                                >
                                    <div className="w-full h-full bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                </div>
                                <div className="flex flex-col justify-between py-1">
                                    <h3 className="font-bold text-md leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                            <Clock size={12} className="text-primary" />
                                            <span>{item.date}</span>
                                        </div>
                                        <span className="text-[10px] font-black italic text-slate-400 group-hover:text-primary transition-colors">Leer Crónica</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default CategoryGrid;
