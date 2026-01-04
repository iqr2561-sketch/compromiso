import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { motion } from 'framer-motion';
import {
    Calendar, User, Clock, Share2, MessageCircle,
    Bookmark, ArrowLeft, Twitter, Facebook, Link as LinkIcon
} from 'lucide-react';
import AdSection from '../components/AdSection';

const Post = () => {
    const { id } = useParams();
    const { news } = useNews();
    const post = news.find(n => n.id === parseInt(id));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <h2 className="text-4xl font-black">404</h2>
                <p className="text-slate-500 font-bold">La noticia que buscas se ha esfumado.</p>
                <Link to="/" className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Volver al Inicio</Link>
            </div>
        );
    }

    const relatedNews = news.filter(n => n.category === post.category && n.id !== post.id).slice(0, 3);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-10"
        >
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between py-4">
                <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
                    <ArrowLeft size={16} /> Volver al Inicio
                </Link>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary">
                        <Share2 size={16} /> Compartir
                    </button>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary">
                        <Bookmark size={16} /> Guardar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content */}
                <article className="lg:col-span-8 flex flex-col gap-8">
                    {/* Hero Image */}
                    <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl shadow-black/10">
                        <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
                        <div className="absolute top-8 left-8">
                            <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                                {post.category}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter italic uppercase">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 border-y border-gray-100 dark:border-white/5 py-6">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-black text-xs border-2 border-white dark:border-surface-dark shadow-lg">
                                    {(post.author || 'A').charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">{post.author || 'Equipo Editorial'}</span>
                                    <span className="text-[10px] font-bold text-slate-400">Cronista Especial</span>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-gray-100 dark:bg-white/5 hidden md:block"></div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <Calendar size={14} className="text-primary" /> {post.date}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <Clock size={14} className="text-primary" /> {post.timeRead || '5 MIN'} LECTURA
                                </div>
                            </div>
                        </div>

                        {/* Article Text */}
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-xl font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic mb-8 border-l-4 border-primary pl-6 py-2">
                                {post.content || "En una jornada histórica para el país, los acontecimientos se desarrollan con una rapidez que desafía los análisis convencionales. Compromiso Diario ha estado en el lugar de los hechos para traer la verdad a nuestros lectores."}
                            </p>

                            <div className="text-lg text-slate-700 dark:text-slate-400 leading-loose flex flex-col gap-6">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

                                <AdSection type="horizontal" className="my-8 h-40" />

                                <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>

                                <blockquote className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] my-10 border border-gray-100 dark:border-white/5">
                                    <p className="text-2xl font-black italic text-slate-900 dark:text-white leading-snug">"La información no solo debe ser rápida, debe ser veraz y comprometerse con el lector por encima de todo interés comercial."</p>
                                    <cite className="mt-4 block text-[10px] font-black uppercase tracking-widest text-primary">— Director Editorial CD</cite>
                                </blockquote>

                                <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
                            </div>
                        </div>

                        {/* Article Footer */}
                        <div className="flex flex-col gap-8 mt-12 pt-12 border-t border-gray-100 dark:border-white/5">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Etiquetas:</span>
                                    {['Sociedad', 'Novedades', post.category].map(t => (
                                        <span key={t} className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-lg text-[9px] font-bold text-slate-600 dark:text-slate-400 group cursor-pointer hover:bg-primary hover:text-white transition-all">#{t}</span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="size-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:bg-[#1DA1F2] hover:text-white transition-all"><Twitter size={16} /></button>
                                    <button className="size-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:bg-[#4267B2] hover:text-white transition-all"><Facebook size={16} /></button>
                                    <button className="size-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-all"><LinkIcon size={16} /></button>
                                </div>
                            </div>

                            {/* Author Card Large */}
                            <div className="bg-gradient-to-br from-slate-900 to-black p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 size-40 bg-primary/20 blur-[100px] rounded-full"></div>
                                <div className="size-24 rounded-full bg-white/10 flex items-center justify-center text-white text-5xl font-black italic relative z-10 border-4 border-white/20">
                                    {(post.author || 'A').charAt(0)}
                                </div>
                                <div className="flex flex-col gap-2 relative z-10 text-center md:text-left">
                                    <h4 className="text-xl font-black uppercase tracking-tighter">Sobre {post.author || 'Redacción CD'}</h4>
                                    <p className="text-sm text-slate-400 font-medium max-w-lg mb-4">Especialista en temas de actualidad y análisis profundo. Con más de 10 años de trayectoria cubriendo las historias más relevantes de la región.</p>
                                    <Link to={`/categoria/${post.category}`} className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:gap-4 transition-all">
                                        Ver todas sus crónicas <ArrowLeft size={14} className="rotate-180" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Sidebar */}
                <aside className="lg:col-span-4 flex flex-col gap-10">
                    {/* Newsletter in Side */}
                    <div className="bg-primary rounded-[3rem] p-10 text-white flex flex-col gap-6 shadow-2xl shadow-primary/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 size-40 bg-white/20 blur-[100px] rounded-full translate-x-20 -translate-y-20"></div>
                        <MessageCircle size={32} className="relative z-10" />
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black italic leading-none mb-2">PRIMICIA EN TU MAIL</h3>
                            <p className="text-sm font-bold opacity-80">Recibe las últimas crónicas antes que nadie en tu bandeja.</p>
                        </div>
                        <input className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none placeholder:text-white/40 focus:bg-white/20 transition-all font-bold text-sm" placeholder="tu@email.com" />
                        <button className="w-full h-14 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Suscribirme Gratis</button>
                    </div>

                    <AdSection type="square" className="h-96" />

                    {/* Related News */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="size-1.5 rounded-full bg-primary mb-1"></div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Noticias Relacionadas</h4>
                        </div>
                        <div className="flex flex-col gap-4">
                            {relatedNews.length > 0 ? relatedNews.map(rn => (
                                <Link to={`/noticia/${rn.id}`} key={rn.id} className="group flex flex-col gap-4 p-4 rounded-3xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 hover:shadow-xl transition-all">
                                    <div className="aspect-video rounded-2xl overflow-hidden">
                                        <img src={rn.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={rn.title} />
                                    </div>
                                    <h5 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">{rn.title}</h5>
                                </Link>
                            )) : (
                                <p className="text-xs text-slate-500 italic">No hay más historias en {post.category} por hoy.</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </motion.div>
    );
};

export default Post;
