import React from 'react';
import { Newspaper, Globe, Instagram, Youtube, Twitter } from 'lucide-react';
import { useNews } from '../context/NewsContext';

const Footer = () => {
    const { footerSettings } = useNews();

    return (
        <footer className="bg-slate-100 dark:bg-[#0a0f1a] border-t border-gray-200 dark:border-white/10 pt-16 pb-8 mt-12 transition-colors duration-300">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                {/* Top Section: Logo, Divider, and Legal Info */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-12">
                    <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">
                        {/* Logo */}
                        <div className="shrink-0">
                            {footerSettings.logo ? (
                                <img src={footerSettings.logo} alt="Logo" className="h-28 md:h-32 w-auto object-contain hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Newspaper className="text-primary mb-2" size={50} />
                                    <span className="font-black italic text-xl tracking-tighter dark:text-white">COMPROMISO</span>
                                </div>
                            )}
                        </div>

                        {/* Vertical Divider (Hidden on mobile) */}
                        <div className="hidden md:block w-px h-24 bg-gray-300 dark:bg-white/10"></div>

                        {/* Legal Text Block */}
                        <div className="flex flex-col gap-1.5 text-center md:text-left">
                            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] text-[12px] italic">
                                {footerSettings.column_4_title || 'DATAFISCAL'}
                            </h4>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold leading-tight">
                                    {footerSettings.copyright}
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold leading-tight uppercase">
                                    {footerSettings.column_2_title || 'Propiedad Intelectual Registrada'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="shrink-0">
                        {footerSettings.qr_image && (
                            <div className="relative group p-2 bg-white dark:bg-white/5 rounded-2xl shadow-xl border border-white dark:border-white/10 hover:shadow-primary/5 transition-all duration-500">
                                <img src={footerSettings.qr_image} alt="Data Fiscal" className="h-28 w-28 md:h-32 md:w-32 object-contain rounded-xl" />
                                <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Horizontal Divider */}
                <div className="w-full h-px bg-gray-300 dark:bg-white/10 mb-8"></div>

                {/* Bottom Section: Director/Description and Socials */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-4">
                    <div className="max-w-3xl">
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] md:text-[12px] font-bold uppercase tracking-tight leading-relaxed text-center lg:text-left">
                            {footerSettings.description}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-5 mr-4 border-r border-gray-300 dark:border-white/10 pr-6">
                            {footerSettings.facebook_url !== '#' && (
                                <a href={footerSettings.facebook_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-all">
                                    <Globe size={18} />
                                </a>
                            )}
                            {footerSettings.instagram_url !== '#' && (
                                <a href={footerSettings.instagram_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-all">
                                    <Instagram size={18} />
                                </a>
                            )}
                        </div>

                        <div className="flex items-center gap-3 py-1.5 px-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest">Sistemas Operativos</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
