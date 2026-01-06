import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CloudSun, Activity, Phone, MapPin, X, Navigation, Sun, Moon, Newspaper, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNews } from '../context/NewsContext';
import { Link } from 'react-router-dom';

const HeaderTop = () => {
    const { pharmacies, pharmacyDuty, editionNumber, news } = useNews();
    const [showPharmacyInfo, setShowPharmacyInfo] = useState(false);
    const [showWeatherInfo, setShowWeatherInfo] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [newsIndex, setNewsIndex] = useState(0);

    // Get latest 10 news for ticker
    const latestNews = news.slice(0, 10);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Auto-rotate news ticker
    useEffect(() => {
        if (latestNews.length === 0) return;
        const timer = setInterval(() => {
            setNewsIndex((prev) => (prev + 1) % latestNews.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [latestNews.length]);

    const formatEdition = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const todayISO = new Date().toISOString().split('T')[0];
    const dutyToday = pharmacyDuty.find(d => d.date === todayISO);
    const pharmacyOnDuty = pharmacies.find(p => p.id === dutyToday?.pharmacyId);

    const today = new Date();
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = today.toLocaleDateString('es-ES', dateOptions);
    const todayDisplay = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    const weatherData = {
        city: 'Ciudad de Dolores',
        current: { temp: 22, condition: 'Parcialmente nublado', humidity: 65, wind: 12 },
        forecast: [
            { day: 'Hoy', high: 24, low: 18, condition: 'Nublado' },
            { day: 'Mañana', high: 26, low: 19, condition: 'Soleado' },
            { day: 'Lunes', high: 23, low: 17, condition: 'Lluvia' }
        ]
    };

    const currentNews = latestNews[newsIndex];

    return (
        <div className="bg-white dark:bg-[#0f172a] text-slate-800 dark:text-white border-b border-gray-200 dark:border-white/5 relative z-[100] transition-colors duration-300">
            <div className="px-4 lg:px-8 max-w-[1440px] mx-auto min-h-[48px] py-2 flex flex-wrap items-center justify-between gap-y-2">
                {/* Left Section: Date & Edition */}
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 hidden md:inline">{todayDisplay}</span>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/5">
                        <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-xs font-bold text-slate-700 dark:text-white">Edición N<sup className="text-[8px]">o</sup> <span className="text-primary font-black">{formatEdition(editionNumber)}</span></span>
                    </div>
                </div>

                {/* Center Section: News Ticker (Desktop Only) */}
                {latestNews.length > 0 && (
                    <div className="hidden lg:flex flex-1 items-center justify-center max-w-xl mx-8">
                        <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-50 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 w-full">
                            <div className="flex items-center gap-2 shrink-0">
                                <Newspaper size={14} className="text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Últimas</span>
                            </div>
                            <div className="relative flex-1 h-5 overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {currentNews && (
                                        <motion.div
                                            key={newsIndex}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -12 }}
                                            className="absolute inset-0 flex items-center"
                                        >
                                            <Link
                                                to={`/noticia/${currentNews.id}`}
                                                className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate hover:text-primary transition-colors"
                                            >
                                                {currentNews.title}
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <ChevronRight size={14} className="text-slate-400 shrink-0" />
                        </div>
                    </div>
                )}

                {/* Right Section: Controls */}
                <div className="flex items-center gap-3 md:gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2 rounded-full bg-slate-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                        title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                    >
                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    {/* Weather Button with Modal */}
                    <div className="relative">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowWeatherInfo(true)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 cursor-pointer transition-all"
                        >
                            <CloudSun size={16} className="text-yellow-500" />
                            <div className="flex items-center gap-1.5 leading-none">
                                <span className="font-black text-sm">{weatherData.current.temp}°C</span>
                            </div>
                        </motion.div>

                        {/* Weather Modal - Portaled to body for perfect positioning */}
                        {createPortal(
                            <AnimatePresence>
                                {showWeatherInfo && (
                                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                                        {/* Backdrop */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setShowWeatherInfo(false)}
                                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                        />

                                        {/* Modal Content */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                            className="relative w-full max-w-[340px] bg-[#1e293b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
                                        >
                                            <div className="bg-gradient-to-r from-yellow-600 to-orange-500 p-5 flex flex-col gap-1">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <CloudSun size={16} className="text-white" />
                                                        <h4 className="font-black text-xs uppercase tracking-wider text-white">
                                                            {weatherData.city}
                                                        </h4>
                                                    </div>
                                                    <button
                                                        onClick={() => setShowWeatherInfo(false)}
                                                        className="size-7 flex items-center justify-center rounded-lg bg-black/10 hover:bg-black/20 text-white transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-5 space-y-4">
                                                {/* Current Weather */}
                                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Ahora</span>
                                                        <CloudSun size={24} className="text-yellow-400" />
                                                    </div>
                                                    <div className="text-3xl font-black text-white mb-1">{weatherData.current.temp}°C</div>
                                                    <div className="text-xs text-slate-400 font-bold mb-3">{weatherData.current.condition}</div>
                                                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-slate-500">💧</span>
                                                            <span className="text-slate-400 font-bold">{weatherData.current.humidity}%</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-slate-500">💨</span>
                                                            <span className="text-slate-400 font-bold">{weatherData.current.wind} km/h</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Forecast */}
                                                <div>
                                                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-3 block">Pronóstico</span>
                                                    <div className="space-y-2">
                                                        {weatherData.forecast.map((day, idx) => (
                                                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                                                <span className="text-xs font-bold text-white w-20">{day.day}</span>
                                                                <span className="text-[10px] text-slate-400 flex-1">{day.condition}</span>
                                                                <div className="flex items-center gap-2 text-xs font-black">
                                                                    <span className="text-white">{day.high}°</span>
                                                                    <span className="text-slate-600">{day.low}°</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </AnimatePresence>,
                            document.body
                        )}
                    </div>

                    <div className="relative flex items-center h-full gap-4">
                        {/* Pharmacy Button with Modal */}
                        <div className="relative flex items-center h-full pl-4 md:pl-6 border-l border-gray-200 dark:border-white/10">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowPharmacyInfo(!showPharmacyInfo)}
                                className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer shadow-lg relative overflow-hidden ${showPharmacyInfo
                                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20'
                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 shadow-emerald-500/5'
                                    }`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 translate-x-[-150%] ${!showPharmacyInfo ? 'animate-[shimmer_2.5s_infinite]' : ''}`} />
                                <Activity size={18} className={showPharmacyInfo ? '' : 'animate-pulse text-emerald-400'} />
                                <div className="flex flex-col items-start leading-none gap-0.5 relative z-10">
                                    <span className="font-black tracking-widest text-[10px] uppercase">Farmacias de Turno</span>
                                    {pharmacyOnDuty && (
                                        <span className={`text-xs font-bold truncate max-w-[140px] ${showPharmacyInfo ? 'text-white' : 'text-emerald-600 dark:text-emerald-300'}`}>
                                            {pharmacyOnDuty.name}
                                        </span>
                                    )}
                                </div>
                            </motion.div>

                            {/* DB Status Test Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={async () => {
                                    try {
                                        const res = await fetch('/api/test-db');
                                        const data = await res.json();
                                        alert(data.message + '\nLatencia: ' + (data.latency || 'N/A'));
                                    } catch (err) {
                                        alert('Error al conectar con la base de datos. Asegúrate de estar corriendo en un entorno que soporte /api (como vercel dev).');
                                    }
                                }}
                                className="ml-3 size-8 flex-shrink-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all group"
                                title="Probar conexión SQL"
                            >
                                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            </motion.button>

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
                                                            {pharmacyOnDuty ? pharmacyOnDuty.name : 'Farmacias de Turno'}
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
        </div>
    );
};

export default HeaderTop;
