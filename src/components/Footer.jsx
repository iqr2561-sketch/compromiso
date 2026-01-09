import React from 'react';
import { Newspaper, Globe, Instagram, Youtube, Twitter } from 'lucide-react';
import { useNews } from '../context/NewsContext';

const Footer = () => {
    const { footerSettings } = useNews();

    return (
        <footer className="max-w-[1440px] mx-auto px-4 lg:px-8 border-t border-gray-200 dark:border-white/10 pt-12 pb-8 mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                {/* Branding Section - Spans 2 columns on large screens */}
                <div className="lg:col-span-2 flex flex-col gap-6 items-center text-center">
                    {footerSettings.logo ? (
                        <img src={footerSettings.logo} alt="Logo" className="h-44 w-auto object-contain mx-auto" />
                    ) : (
                        <Newspaper className="text-primary mx-auto" size={80} />
                    )}
                    <p className="text-slate-500 text-sm leading-relaxed font-semibold max-w-lg mx-auto">
                        {footerSettings.description}
                    </p>
                </div>

                {/* Empty spacer to push content or for future use */}
                <div className="hidden lg:block"></div>

                {/* Social Media Section */}
                <div className="flex flex-col gap-6">
                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic border-b border-gray-100 dark:border-white/5 pb-2">CONECTATE</h4>
                    <div className="flex flex-col gap-4">
                        {footerSettings.facebook_url !== '#' && (
                            <a href={footerSettings.facebook_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-500 hover:text-primary transition-all group">
                                <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Globe size={18} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Facebook</span>
                            </a>
                        )}
                        {footerSettings.instagram_url !== '#' && (
                            <a href={footerSettings.instagram_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-500 hover:text-primary transition-all group">
                                <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Instagram size={18} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Instagram</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Fiscal/QR Section */}
                <div className="flex flex-col items-center md:items-end">
                    {footerSettings.qr_image && (
                        <div className="flex flex-col items-center md:items-end gap-3">
                            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic border-b border-gray-100 dark:border-white/5 pb-2 w-full text-center md:text-right">LEGAL</h4>
                            <div className="relative group">
                                <img src={footerSettings.qr_image} alt="Data Fiscal" className="h-24 w-24 object-contain rounded-xl bg-white p-1 hover:scale-105 transition-transform shadow-xl border border-gray-100" />
                                <div className="absolute inset-0 rounded-xl bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic">Data Fiscal</p>
                        </div>
                    )}
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
