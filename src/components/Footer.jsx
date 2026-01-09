import React from 'react';
import { Newspaper, Globe, Instagram, Youtube, Twitter } from 'lucide-react';
import { useNews } from '../context/NewsContext';

const Footer = () => {
    const { footerSettings } = useNews();

    return (
        <footer className="max-w-[1440px] mx-auto px-4 lg:px-8 border-t border-gray-200 dark:border-white/10 pt-12 pb-8 mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
                <div className="col-span-2 lg:col-span-2 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        {footerSettings.logo ? (
                            <img src={footerSettings.logo} alt="Logo" className="h-10 object-contain" />
                        ) : (
                            <Newspaper className="text-primary" size={30} />
                        )}
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">Compromiso Diario</h2>
                    </div>
                    <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                        {footerSettings.description}
                    </p>

                    {footerSettings.qr_image && (
                        <div className="mt-2">
                            <img src={footerSettings.qr_image} alt="Data Fiscal" className="h-20 w-20 object-contain rounded-lg bg-white p-1 shadow-sm border border-gray-100" />
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Data Fiscal</p>
                        </div>
                    )}

                    <div className="flex gap-4 mt-2">
                        {footerSettings.facebook_url !== '#' && <a href={footerSettings.facebook_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-colors"><Globe size={20} /></a>}
                        {footerSettings.instagram_url !== '#' && <a href={footerSettings.instagram_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-colors"><Instagram size={20} /></a>}
                        {footerSettings.youtube_url !== '#' && <a href={footerSettings.youtube_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-colors"><Youtube size={20} /></a>}
                        {footerSettings.twitter_url !== '#' && <a href={footerSettings.twitter_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-colors"><Twitter size={20} /></a>}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{footerSettings.column_2_title}</h4>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Actualidad</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Tecnología</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Deportes</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Opinión</a>
                </div>

                <div className="flex flex-col gap-3">
                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{footerSettings.column_3_title}</h4>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Nosotros</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Carreras</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Publicidad</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Contacto</a>
                </div>

                <div className="flex flex-col gap-3">
                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{footerSettings.column_4_title}</h4>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Privacidad</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Términos</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">Cookies</a>
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
