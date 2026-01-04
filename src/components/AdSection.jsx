import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useNews } from '../context/NewsContext';

const AdSection = ({ type = 'horizontal', className = '' }) => {
    const { ads } = useNews();

    // Find active ad of specific type from context, or fallback to first one of that type, or default info
    const dynamicAd = ads.find(a => a.type === type && a.active);

    const defaultAds = {
        horizontal: {
            title: 'ESPACIO PUBLICITARIO',
            content: 'Impulsa tu negocio en el diario más leído de la región',
            subContent: 'Planes desde $99/mes con alcance garantizado.',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
            button: 'Comenzar Ahora',
            link: '#'
        },
        square: {
            title: 'PUBLICIDAD LOCAL',
            content: 'Llega a miles de clientes hoy',
            image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400',
            button: 'Ver Tarifas',
            link: '#'
        },
        premium: {
            title: 'PARTNER EXCLUSIVO',
            content: 'Nuevas Inversiones inmobiliarias en la costa',
            subContent: 'Últimas unidades disponibles con financiación propia.',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
            button: 'Más Información',
            link: '#'
        }
    };

    const ad = dynamicAd ? {
        ...defaultAds[type],
        image: dynamicAd.image,
        link: dynamicAd.link,
        content: dynamicAd.content || defaultAds[type].content
    } : defaultAds[type] || defaultAds.horizontal;

    if (type === 'horizontal' || type === 'premium') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                onClick={() => window.open(ad.link, '_blank')}
                className={`w-full h-40 md:h-32 bg-slate-100 dark:bg-surface-darker rounded-3xl overflow-hidden flex items-center border border-gray-200 dark:border-white/5 relative group cursor-pointer ${className}`}
            >
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity bg-cover bg-center grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100 duration-700" style={{ backgroundImage: `url(${ad.image})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-100/80 to-transparent dark:from-surface-darker dark:via-surface-darker/80"></div>

                <div className="w-full px-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 z-10">
                    <div className="flex flex-col text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{ad.title}</span>
                            <span className="size-1 rounded-full bg-slate-300"></span>
                            <span className="text-[9px] font-bold text-slate-400">PATROCINADO</span>
                        </div>
                        <h4 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-tight">{ad.content}</h4>
                        <p className="hidden md:block text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-tighter">{ad.subContent}</p>
                    </div>
                    <button className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center gap-2 group/btn">
                        {ad.button}
                        <ExternalLink size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div
            onClick={() => window.open(ad.link, '_blank')}
            className={`aspect-square bg-slate-100 dark:bg-surface-darker rounded-3xl p-8 border border-gray-200 dark:border-white/5 flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden group cursor-pointer ${className}`}
        >
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-200/50 dark:from-black/20 to-transparent"></div>
            <div className="flex flex-col gap-1 z-10">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{ad.title}</span>
                <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{ad.content}</h4>
            </div>
            <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden z-10 border border-white/5">
                <img src={ad.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="ad" />
            </div>
            <button className="w-full py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-gray-200 dark:border-white/10 text-[10px] font-black rounded-xl hover:bg-primary hover:text-white transition-all z-10 uppercase tracking-widest shadow-lg">
                {ad.button}
            </button>
        </div>
    );
};

export default AdSection;
