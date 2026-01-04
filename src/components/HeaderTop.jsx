import React, { useState } from 'react';
import { CloudSun, Activity, Phone, MapPin, X, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeaderTop = () => {
    const [showPharmacyInfo, setShowPharmacyInfo] = useState(false);
    const today = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="bg-[#0f172a] text-white text-[11px] font-medium border-b border-white/5 relative z-[100]">
            <div className="px-4 lg:px-8 max-w-[1440px] mx-auto h-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="opacity-60 hidden sm:inline capitalize font-light">{today}</span>
                    <div className="flex items-center gap-2 px-2 py-0.5 bg-white/5 rounded-full border border-white/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        <span className="tracking-wide text-[10px]">EDICIÓN DIGITAL <span className="text-primary font-black">#42.891</span></span>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                    <div className="flex items-center gap-2.5 group cursor-help transition-opacity hover:opacity-80" title="Pronóstico Local">
                        <CloudSun size={16} className="text-yellow-400 animate-float" />
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-sm">22°C</span>
                            <span className="text-[9px] opacity-50 uppercase tracking-tighter">Buenos Aires</span>
                        </div>
                    </div>

                    <div className="relative flex items-center h-full pl-4 md:pl-8 border-l border-white/10">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowPharmacyInfo(!showPharmacyInfo)}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-500/5 ${showPharmacyInfo
                                ? 'bg-emerald-500 border-emerald-400 text-white'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                }`}
                        >
                            <Activity size={12} className={showPharmacyInfo ? '' : 'animate-pulse'} />
                            <span className="font-black tracking-widest text-[10px]">FARMACIA DE TURNO</span>
                        </motion.div>

                        <AnimatePresence>
                            {showPharmacyInfo && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setShowPharmacyInfo(false)}
                                        className="fixed inset-0 z-[110] bg-black/20 backdrop-blur-[2px]"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        className="absolute top-12 right-0 w-80 bg-[#1e293b] border border-white/10 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] z-[120] overflow-hidden"
                                    >
                                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 flex flex-col gap-1">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="size-8 rounded-xl bg-white/20 flex items-center justify-center">
                                                        <Activity size={18} className="text-white" />
                                                    </div>
                                                    <h4 className="font-black text-sm uppercase tracking-wider text-white">Farmacia Central</h4>
                                                </div>
                                                <button
                                                    onClick={() => setShowPharmacyInfo(false)}
                                                    className="size-8 flex items-center justify-center rounded-xl bg-black/10 hover:bg-black/20 text-white transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-emerald-100 font-medium tracking-wide mt-1">Sustentando la salud de la comunidad 24/7</p>
                                        </div>

                                        <div className="p-6 space-y-5">
                                            <div className="flex items-start gap-4 group">
                                                <div className="size-10 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-emerald-500/30 transition-colors">
                                                    <MapPin size={20} className="text-emerald-400" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Ubicación</span>
                                                    <p className="text-sm font-bold text-slate-200">Av. Rivadavia 4500, Almagro, CABA</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4 group">
                                                <div className="size-10 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-emerald-500/30 transition-colors">
                                                    <Phone size={20} className="text-emerald-400" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Contacto Directo</span>
                                                    <p className="text-sm font-bold text-slate-200">+54 11 4981-1234</p>
                                                </div>
                                            </div>

                                            <div className="pt-2 flex flex-col gap-3">
                                                <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-[0.98]">
                                                    <Navigation size={18} />
                                                    ¿CÓMO LLEGAR?
                                                </button>
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Servicio Abierto 24hs</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderTop;
