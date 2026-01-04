import React, { useState } from 'react';
import { CloudSun, Activity, Phone, MapPin, X, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNews } from '../context/NewsContext';

const HeaderTop = () => {
    const { pharmacies, pharmacyDuty } = useNews();
    const [showPharmacyInfo, setShowPharmacyInfo] = useState(false);

    const todayISO = new Date().toISOString().split('T')[0];
    const dutyToday = pharmacyDuty.find(d => d.date === todayISO);
    const pharmacyOnDuty = pharmacies.find(p => p.id === dutyToday?.pharmacyId);

    const todayDisplay = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="bg-[#0f172a] text-white text-[11px] font-medium border-b border-white/5 relative z-[100]">
            <div className="px-4 lg:px-8 max-w-[1440px] mx-auto min-h-[40px] py-1 flex flex-wrap items-center justify-between gap-y-1">
                <div className="flex items-center gap-3">
                    <span className="opacity-60 hidden md:inline capitalize font-light">{todayDisplay}</span>
                    <div className="flex items-center gap-2 px-2 py-0.5 bg-white/5 rounded-full border border-white/5">
                        <span className="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
                        <span className="tracking-widest text-[9px] uppercase font-black">EDICIÓN <span className="text-primary">42.891</span></span>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                    <div className="flex items-center gap-2 group cursor-help transition-opacity hover:opacity-80" title="Pronóstico Local">
                        <CloudSun size={14} className="text-yellow-400 animate-float" />
                        <div className="flex items-center gap-1.5 leading-none">
                            <span className="font-black text-[12px]">22°C</span>
                            <span className="text-[8px] opacity-40 uppercase tracking-tighter hidden xs:inline">Buenos Aires</span>
                        </div>
                    </div>

                    <div className="relative flex items-center h-full pl-4 md:pl-8 border-l border-white/10">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowPharmacyInfo(!showPharmacyInfo)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-500/5 ${showPharmacyInfo
                                ? 'bg-emerald-500 border-emerald-400 text-white'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                }`}
                        >
                            <Activity size={10} className={showPharmacyInfo ? '' : 'animate-pulse'} />
                            <span className="font-black tracking-widest text-[8px] uppercase">Farmacia</span>
                        </motion.div>

                        <AnimatePresence>
                            {showPharmacyInfo && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setShowPharmacyInfo(false)}
                                        className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-[2px]"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        className="absolute top-10 right-0 w-72 bg-[#1e293b] border border-white/10 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] z-[120] overflow-hidden"
                                    >
                                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-5 flex flex-col gap-1">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <Activity size={16} className="text-white" />
                                                    <h4 className="font-black text-xs uppercase tracking-wider text-white truncate max-w-[150px]">
                                                        {pharmacyOnDuty ? pharmacyOnDuty.name : 'Consultar Farmacia'}
                                                    </h4>
                                                </div>
                                                <button
                                                    onClick={() => setShowPharmacyInfo(false)}
                                                    className="size-7 flex items-center justify-center rounded-lg bg-black/10 hover:bg-black/20 text-white transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-5 space-y-4">
                                            <div className="flex items-start gap-3">
                                                <MapPin size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Ubicación</span>
                                                    <p className="text-xs font-bold text-slate-200">{pharmacyOnDuty ? pharmacyOnDuty.address : 'Ver en mapa'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Phone size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Contacto Directo</span>
                                                    <p className="text-xs font-bold text-slate-200">{pharmacyOnDuty ? pharmacyOnDuty.phone : 'Cargando...'}</p>
                                                </div>
                                            </div>

                                            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black text-[10px] py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 uppercase tracking-widest">
                                                <Navigation size={14} />
                                                ¿CÓMO LLEGAR?
                                            </button>
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
