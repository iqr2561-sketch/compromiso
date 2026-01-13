import React from 'react';
import { Newspaper, Globe, Instagram, Youtube, Twitter } from 'lucide-react';
import { useNews } from '../context/NewsContext';

const Footer = () => {
    const { footerSettings } = useNews();

    return (
        <footer className="bg-slate-50 dark:bg-[#080c14] border-t-4 border-primary/10 pt-20 pb-10 mt-16 transition-colors duration-500">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                {/* Top Section: Logo, Divider, and Legal Info */}
                {/* Top Section: Logo and Description Centered */}
                <div className="flex flex-col items-center gap-10 mb-16">
                    <div className="flex flex-col items-center gap-8 w-full">
                        {/* Logo */}
                        <div className="shrink-0 flex items-center justify-center">
                            {footerSettings.logo ? (
                                <img src={footerSettings.logo} alt="Logo" className="h-32 md:h-48 w-auto object-contain hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Newspaper className="text-primary mb-2" size={60} />
                                    <span className="font-black italic text-2xl tracking-tighter dark:text-white">COMPROMISO</span>
                                </div>
                            )}
                        </div>

                        {/* Description (Moved here and centered) */}
                        <div className="max-w-5xl text-center px-4">
                            <p className="text-slate-500 dark:text-slate-400 text-[11px] md:text-[13px] font-bold uppercase tracking-tight leading-relaxed">
                                {footerSettings.description}
                            </p>
                        </div>
                    </div>

                    {/* Secondary Section: Legal Info and QR */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 w-full">
                        {/* Legal Text Block */}
                        <div className="flex flex-col gap-1.5 text-center">
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

                        {/* QR Code Section */}
                        <div className="shrink-0">
                            {footerSettings.qr_image && (
                                <div className="relative group p-2 bg-white dark:bg-white/5 rounded-2xl shadow-xl border border-white dark:border-white/10 hover:shadow-primary/5 transition-all duration-500">
                                    <img src={footerSettings.qr_image} alt="Data Fiscal" className="h-24 w-24 md:h-28 md:w-28 object-contain rounded-xl" />
                                    <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Horizontal Divider */}
                <div className="w-full h-px bg-gray-300 dark:bg-white/10 mb-8"></div>

                {/* Bottom Section: Socials and Systems Status */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-4">
                    <div className="flex items-center gap-3 py-1.5 px-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest">Sistemas Operativos</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-5">
                            {footerSettings.facebook_url !== '#' && (
                                <a href={footerSettings.facebook_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-all hover:scale-110">
                                    <Globe size={18} />
                                </a>
                            )}
                            {footerSettings.instagram_url !== '#' && (
                                <a href={footerSettings.instagram_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-all hover:scale-110">
                                    <Instagram size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
