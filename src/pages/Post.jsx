import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { motion } from 'framer-motion';
import {
    Calendar, Clock, Share2, MessageCircle,
    Bookmark, ArrowLeft, Twitter, Facebook, Link as LinkIcon
} from 'lucide-react';
import AdSection from '../components/AdSection';

const Post = () => {
    const { id } = useParams();
    const { news, footerSettings } = useNews();
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
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter italic">
                            {post.title ? post.title.charAt(0).toUpperCase() + post.title.slice(1).toLowerCase() : ''}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 border-y border-gray-100 dark:border-white/5 py-6">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <Calendar size={14} className="text-primary" />
                                    {new Date(post.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Article Text - Block Renderer */}
                    <div className="prose dark:prose-invert max-w-none">
                        <div className="text-base md:text-lg text-slate-700 dark:text-slate-400 leading-loose flex flex-col gap-10 text-justify">
                            {(() => {
                                try {
                                    let blocks = post.content;

                                    // Handle stringified JSON
                                    if (typeof blocks === 'string') {
                                        // If it looks like JSON, try to parse
                                        if (blocks.trim().startsWith('[') || blocks.trim().startsWith('{')) {
                                            try {
                                                blocks = JSON.parse(blocks);
                                                // Handle double stringification
                                                if (typeof blocks === 'string') {
                                                    blocks = JSON.parse(blocks);
                                                }
                                            } catch (e) {
                                                // If parsing fails but it starts with brackets, it might be raw text that just looks like JSON or malformed. 
                                                // Fallback to text rendering.
                                                throw e;
                                            }
                                        }
                                    }

                                    if (Array.isArray(blocks)) {
                                        return blocks.map((block, i) => (
                                            block.type === 'text' ? (
                                                <p key={i} className="text-base md:text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-justify">
                                                    {block.content}
                                                </p>
                                            ) : (
                                                <div key={i} className="flex flex-col gap-4">
                                                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
                                                        <img src={block.content} className="w-full" alt="" />
                                                    </div>
                                                </div>
                                            )
                                        ));
                                    } else {
                                        // It's a string content (legacy)
                                        return (
                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic mb-8 border-l-4 border-primary pl-6 py-2 text-justify">
                                                {typeof post.content === 'string' ? post.content : "Contenido no disponible"}
                                            </p>
                                        );
                                    }
                                } catch (e) {
                                    // Fallback for legacy text content or parse error
                                    return (
                                        <p className="text-lg font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic mb-8 border-l-4 border-primary pl-6 py-2 text-justify">
                                            {typeof post.content === 'string' ? post.content : "Error al cargar contenido"}
                                        </p>
                                    );
                                }
                            })()}
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

                        {/* Data Fiscal Section Refactored */}
                        <div className="flex flex-col items-center gap-4 py-12 border-b border-gray-100 dark:border-white/5">
                            <div className="flex flex-col items-center gap-2">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{footerSettings.column_4_title || 'DATAFISCAL'}</h4>
                                {footerSettings.qr_image ? (
                                    <a href="https://www.afip.gob.ar/" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:opacity-100 transition-all hover:scale-105 duration-300">
                                        <img src={footerSettings.qr_image} alt="Data Fiscal" className="h-24 md:h-28 w-auto object-contain" />
                                    </a>
                                ) : (
                                    <img src="https://images.afip.gob.ar/images/datafiscal96x96.png" alt="Data Fiscal" className="h-24 opacity-20 grayscale" />
                                )}
                            </div>
                            <div className="flex flex-col items-center text-center gap-1">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight max-w-md">{footerSettings.description}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{footerSettings.column_2_title || 'Propiedad Intelectual Registrada'}</p>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-slate-50 dark:bg-white/5 p-8 md:p-12 rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-black/5 mt-4">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
                                    <MessageCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white leading-none">Deja tu Comentario</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tu opinión enriquece la noticia</p>
                                </div>
                            </div>

                            <form className="flex flex-col gap-5" onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const commentData = {
                                    newsId: post.id,
                                    userName: formData.get('userName'),
                                    email: formData.get('email'),
                                    content: formData.get('content')
                                };

                                try {
                                    const res = await fetch('/api/comments', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(commentData)
                                    });
                                    if (res.ok) {
                                        alert("¡Gracias! Tu comentario ha sido enviado y está pendiente de aprobación.");
                                        e.target.reset();
                                    } else {
                                        alert("Hubo un error al enviar el comentario.");
                                    }
                                } catch (err) {
                                    console.error("Error submitting comment:", err);
                                }
                            }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Nombre Completo</label>
                                        <input required name="userName" type="text" placeholder="Tu Nombre" className="px-6 py-4 rounded-2xl bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 outline-none focus:border-primary transition-all font-bold text-sm shadow-sm" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Tu Email</label>
                                        <input required name="email" type="email" placeholder="email@ejemplo.com" className="px-6 py-4 rounded-2xl bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 outline-none focus:border-primary transition-all font-bold text-sm shadow-sm" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Mensaje</label>
                                    <textarea required name="content" placeholder="Escribe lo que piensas sobre esta noticia..." rows="5" className="px-6 py-4 rounded-2xl bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 outline-none focus:border-primary transition-all font-bold text-sm shadow-sm resize-none"></textarea>
                                </div>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-2 rounded-full bg-amber-400 animate-pulse"></div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Los comentarios requieren revisión editorial.</p>
                                    </div>
                                    <button type="submit" className="w-full md:w-auto px-10 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">Publicar Comentario</button>
                                </div>
                            </form>
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
