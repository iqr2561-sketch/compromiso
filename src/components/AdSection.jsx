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
        hero_1: {
            title: 'ANUNCIATE AQUÍ',
            content: 'Espacio Disponible',
            subContent: '',
            image: '',
            button: 'Contactar',
            link: '#'
        },
        hero_2: {
            title: 'ANUNCIATE AQUÍ',
            content: 'Espacio Disponible',
            subContent: '',
            image: '',
            button: 'Contactar',
            link: '#'
        },
        hero_3: {
            title: 'ANUNCIATE AQUÍ',
            content: 'Espacio Disponible',
            subContent: '',
            image: '',
            button: 'Contactar',
            link: '#'
        },
        // Generic fallback for other types
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

    console.log('AdSection render - type:', type, 'dynamicAd:', dynamicAd, 'allAds:', ads.filter(a => a.type === type));

    const ad = dynamicAd ? {
        ...adData,
        image: dynamicAd.image || adData.image,
        link: dynamicAd.link || adData.link,
        content: dynamicAd.content || adData.content,
        title: dynamicAd.title || adData.title, // Ensure title is used if available
        subContent: dynamicAd.sub_content || adData.subContent, // Map sub_content from DB
        button: dynamicAd.button || adData.button
    } : adData;

    // Unified render for all ad types
    return (
        <div
            onClick={() => ad.link && ad.link !== '#' && window.open(ad.link, '_blank')}
            className={`relative overflow-hidden group ${ad.link && ad.link !== '#' ? 'cursor-pointer' : 'cursor-default'} ${className} ${!className.includes('h-') && 'min-h-[100px]'}`}
        >
            {ad.image ? (
                <img
                    src={ad.image}
                    className="w-full h-full"
                    alt={ad.title || "Publicidad"}
                    style={{ objectFit: 'contain' }} // 'contain' ensures the full image is visible without cropping or distortion, maintaining aspect ratio.
                />
            ) : (
                // Fallback only if no image
                <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4 text-center border border-dashed border-gray-300 dark:border-white/10">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Espacio Publicitario</span>
                    <span className="text-xs font-bold text-slate-300 mt-1">{type}</span>
                </div>
            )}
        </div>
    );
};

export default AdSection;
