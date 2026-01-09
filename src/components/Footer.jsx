import React from 'react';
import { Newspaper, Globe, Instagram, Youtube, Twitter } from 'lucide-react';
import { useNews } from '../context/NewsContext';

const Footer = () => {
    const { footerSettings } = useNews();

    return (
        <footer className="max-w-[1440px] mx-auto px-4 lg:px-8 border-t border-gray-200 dark:border-white/10 pt-12 pb-8 mt-12">
            <div className="flex flex-col items-center text-center gap-6 mb-12">
                <div className="flex flex-col items-center gap-4 max-w-2xl px-4">
                    {footerSettings.logo ? (
                        <img src={footerSettings.logo} alt="Logo" className="h-16 w-auto object-contain mx-auto" />
                    ) : (
                        <Newspaper className="text-primary mx-auto" size={40} />
                    )}
                    <p className="text-slate-500 text-sm leading-loose font-medium">
                        {footerSettings.description}
                    </p>

                    <div className="flex gap-6 mt-2 justify-center">
                        {footerSettings.facebook_url !== '#' && <a href={footerSettings.facebook_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-all hover:scale-110"><Globe size={20} /></a>}
                        {footerSettings.instagram_url !== '#' && <a href={footerSettings.instagram_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-all hover:scale-110"><Instagram size={20} /></a>}
                        {footerSettings.youtube_url !== '#' && <a href={footerSettings.youtube_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-all hover:scale-110"><Youtube size={20} /></a>}
                        {footerSettings.twitter_url !== '#' && <a href={footerSettings.twitter_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-all hover:scale-110"><Twitter size={20} /></a>}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full mt-8 border-t border-gray-100 dark:border-white/5 pt-12">
                    <div className="flex flex-col gap-3 items-center md:items-start">
                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{footerSettings.column_2_title}</h4>
                        <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Actualidad</a>
                        <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Tecnología</a>
                        <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Deportes</a>
                        <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Opinión</a>
                    </div>

                    <div className="flex flex-col gap-3 items-center md:items-start">
                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{footerSettings.column_3_title}</h4>
                        <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Nosotros</a>
                        <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Carreras</a>
                        <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Publicidad</a>
                        <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Contacto</a>
                    </div>

                    <div className="flex flex-col gap-3 items-center md:items-start">
                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{footerSettings.column_4_title}</h4>
                        <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Privacidad</a>
                        <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Términos</a>
                        <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Cookies</a>
                    </div>

                    <div className="flex flex-col gap-3 items-center md:items-center">
                        {footerSettings.qr_image && (
                            <div className="flex flex-col items-center">
                                <img src={footerSettings.qr_image} alt="Data Fiscal" className="h-16 w-16 object-contain rounded-lg bg-white p-1 shadow-sm border border-gray-100" />
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-2 italic">Data Fiscal</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200 dark:border-white/5 gap-4">
                <p className="text-xs text-slate-500 font-medium">{footerSettings.copyright}</p>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs text-slate-500 font-black uppercase tracking-widest">Sistemas Operativos</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
