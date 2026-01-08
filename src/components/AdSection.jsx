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
        },
        // Generic fallback for hero/other types
        default: {
            title: 'ANUNCIATE AQUÍ',
            content: 'Espacio Disponible',
            subContent: '',
            image: '',
            button: 'Contactar',
            link: '#'
        }
    };

    const adData = defaultAds[type] || defaultAds.default;

    const ad = dynamicAd ? {
        ...adData,
        image: dynamicAd.image || adData.image,
        link: dynamicAd.link || adData.link,
        content: dynamicAd.content || adData.content,
        title: dynamicAd.title || adData.title, // Ensure title is used if available
        subContent: dynamicAd.sub_content || adData.subContent, // Map sub_content from DB
        button: dynamicAd.button || adData.button
    } : adData;

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
            className={`aspect-square bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden group cursor-pointer relative border border-gray-200 dark:border-white/5 ${className}`}
        >
            {ad.image ? (
                <>
                    <img src={ad.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={ad.title} />
                    {/* Optional subtle overlay on hover to indicate clickability */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">{ad.title}</span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{ad.content}</h4>
                    {ad.subContent && <p className="text-xs text-slate-500 mt-2 font-bold">{ad.subContent}</p>}
                    <span className="mt-4 px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
                        {ad.button}
                    </span>
                </div>
            )}
        </div>
    );
};

export default AdSection;
