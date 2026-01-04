import React from 'react';
import HeroSection from '../components/HeroSection';
import FlashNews from '../components/FlashNews';
import CategoryGrid from '../components/CategoryGrid';
import MultimediaSection from '../components/MultimediaSection';
import Newsletter from '../components/Newsletter';
import AdSection from '../components/AdSection';
import { motion } from 'framer-motion';
import { History, TrendingUp, Star, Bell } from 'lucide-react';

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-14"
        >
            <HeroSection />

            {/* Quick Stats / Trending Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Tendencia del día', title: 'Elon Musk confirma base en Marte', icon: <TrendingUp size={18} className="text-primary" /> },
                    { label: 'Exclusivo Gold', title: 'Infraestructura del Sur: Informe', icon: <Star size={18} className="text-yellow-500" /> },
                    { label: 'Última Alerta', title: 'Medidas económicas para Enero', icon: <Bell size={18} className="text-accent-pink" /> },
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-surface-dark p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 flex items-center gap-4 hover:shadow-xl transition-all shadow-lg shadow-black/5 cursor-pointer group">
                        <div className="size-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            {item.icon}
                        </div>
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary transition-colors">{item.label}</span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Premium Ad below Hero */}
            <AdSection type="premium" className="shadow-2xl shadow-primary/5" />

            <FlashNews />

            {/* High Impact Multimedia Section */}
            <MultimediaSection />

            {/* Grid of ads for diversity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 flex flex-col gap-8">
                    <CategoryGrid />
                </div>
                <div className="flex flex-col gap-8">
                    <AdSection type="square" className="h-[500px]" />
                    <div className="bg-gradient-to-br from-primary to-accent-purple p-10 rounded-[3rem] text-white flex flex-col gap-6 shadow-2xl shadow-primary/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 size-40 bg-white/20 blur-[100px] rounded-full translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-1000"></div>
                        <h4 className="text-3xl font-black italic tracking-tighter uppercase relative z-10">Exclusivo</h4>
                        <p className="text-sm font-bold opacity-90 leading-relaxed relative z-10">Accede a contenido sin publicidad y reportajes especiales con nuestra suscripción GOLD.</p>
                        <ul className="text-[10px] font-black uppercase tracking-widest flex flex-col gap-2 opacity-60 relative z-10">
                            <li>• Crónicas Sin Censura</li>
                            <li>• Reportes Financieros</li>
                            <li>• Acceso VIP a Eventos</li>
                        </ul>
                        <button className="mt-4 py-4 bg-white text-primary font-black text-[10px] rounded-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest shadow-xl relative z-10 shadow-black/20">
                            Unirse ahora por $9.99
                        </button>
                    </div>

                    <div className="bg-slate-900 p-1 rounded-[3rem] overflow-hidden group">
                        <div className="bg-[#111318] p-8 rounded-[2.8rem] flex flex-col gap-4 border border-white/5">
                            <h5 className="text-white font-black uppercase tracking-[0.2em] text-[10px]">Patrocinado por</h5>
                            <img src="https://images.unsplash.com/photo-1614680376593-902f74cc0d41?auto=format&fit=crop&q=80&w=400" className="w-full h-32 object-cover rounded-2xl grayscale hover:grayscale-0 transition-all cursor-pointer" alt="sponsor" />
                        </div>
                    </div>
                </div>
            </div>

            <AdSection type="horizontal" className="bg-slate-900 dark:bg-surface-darker border-none h-40" />

            <Newsletter />

            {/* Legacy Version Button */}
            <div className="flex justify-center py-10">
                <a
                    href="/legacy.html"
                    className="flex items-center gap-4 px-10 py-5 rounded-full bg-slate-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-slate-500 hover:text-primary dark:hover:text-white transition-all hover:shadow-2xl group shadow-lg"
                >
                    <History size={20} className="group-hover:rotate-[-45deg] transition-transform" />
                    <span className="text-sm font-black uppercase tracking-widest">Ver Edición Clásica del Diario</span>
                </a>
            </div>
        </motion.div>
    );
};

export default Home;
