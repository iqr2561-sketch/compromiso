import React, { useState } from 'react';
import { PlayCircle, Star, ArrowRight, Eye, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNews } from '../context/NewsContext';

const MultimediaSection = () => {
    const { videos } = useNews();
    const [selectedVideo, setSelectedVideo] = useState(null);

    return (
        <section className="flex flex-col gap-10 py-16">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <div className="size-14 rounded-2xl bg-[#000] dark:bg-white flex items-center justify-center text-white dark:text-[#000] shadow-2xl">
                        <PlayCircle size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">Videos del Día</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="size-1.5 rounded-full bg-accent-pink animate-pulse"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Contenido Audiovisual Exclusivo</span>
                        </div>
                    </div>
                </div>
                <button className="hidden md:flex items-center gap-3 group text-[11px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-6 py-3 rounded-full border border-primary/10 hover:bg-primary hover:text-white transition-all">
                    Explorar Galería <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {videos.map((video, idx) => (
                    <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => setSelectedVideo(video)}
                        className="group relative h-[500px] rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl border border-white/5 bg-[#111]"
                    >
                        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100" style={{ backgroundImage: `url(${video.image})` }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                            {/* Animated Pulse Ring */}
                            <div className="absolute size-32 rounded-full border-2 border-white/30 animate-ping"></div>

                            {/* Main Button */}
                            <div className="size-24 rounded-full bg-white/20 backdrop-blur-2xl border border-white/40 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] scale-75 group-hover:scale-100 transition-transform duration-500">
                                <div className="size-16 rounded-full bg-white flex items-center justify-center pl-1.5 shadow-2xl">
                                    <PlayCircle size={40} className="text-primary fill-primary" />
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-8 left-8 flex flex-col gap-2">
                            <span className="px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest text-white self-start">
                                {video.category}
                            </span>
                        </div>

                        <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-white bg-primary px-3 py-1 rounded-md shadow-lg">{video.duration}</span>
                                <div className="flex items-center gap-2 text-[10px] font-black text-white/80 uppercase tracking-widest">
                                    <Eye size={14} className="text-primary" /> {video.views} vistas
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-white leading-tight italic group-hover:text-primary transition-colors">{video.title}</h3>
                            <div className="flex items-center gap-6 pt-2 border-t border-white/10">
                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                                    <MessageCircle size={16} /> Comentar
                                </button>
                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                                    <Star size={16} /> Guardar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Video Modal Player */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            className="absolute top-10 right-10 size-14 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all z-[110]"
                            onClick={() => setSelectedVideo(null)}
                        >
                            <X size={32} />
                        </motion.button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="relative w-full max-w-6xl aspect-video rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(37,106,244,0.3)] bg-black border border-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            <iframe
                                className="w-full h-full"
                                src={`${selectedVideo.url}?autoplay=1`}
                                title={selectedVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </motion.div>

                        <div className="absolute bottom-10 left-10 text-white max-w-2xl">
                            <span className="text-primary font-black uppercase tracking-widest text-xs mb-2 block">{selectedVideo.category}</span>
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{selectedVideo.title}</h2>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default MultimediaSection;
