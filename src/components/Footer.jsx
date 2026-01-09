import React from 'react';
import { Newspaper, Globe, Instagram, Youtube, Twitter } from 'lucide-react';
import { useNews } from '../context/NewsContext';

const Footer = () => {
    const { footerSettings } = useNews();

    return (
        <footer className="bg-slate-100 dark:bg-[#0a0f1a] border-t border-gray-200 dark:border-white/10 pt-16 pb-12 mt-12 transition-colors duration-300">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-center mb-16">
                    {/* Column 1: Logo */}
                    <div className="flex justify-center lg:justify-start">
                        {footerSettings.logo ? (
                            <img src={footerSettings.logo} alt="Logo" className="h-40 w-auto object-contain hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="flex flex-col items-center lg:items-start">
                                <Newspaper className="text-primary mb-2" size={60} />
                                <span className="font-black italic text-2xl tracking-tighter dark:text-white">COMPROMISO</span>
                            </div>
                        )}
                    </div>

                    {/* Column 2: Intellectual Property */}
                    <div className="flex flex-col items-center lg:items-start gap-2 border-l-0 lg:border-l border-gray-300 dark:border-white/10 lg:pl-8">
                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px] italic">{footerSettings.column_2_title || 'Propiedad Intelectual'}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed text-center lg:text-left">
                            {footerSettings.copyright}
                        </p>
                    </div>

                    {/* Columns 3 & 4: Data Fiscal QR */}
                    <div className="md:col-span-2 flex justify-center lg:justify-end items-center gap-8">
                        {footerSettings.qr_image && (
                            <div className="flex items-center gap-6 bg-white dark:bg-white/5 p-4 rounded-3xl shadow-2xl border border-white dark:border-white/10 hover:shadow-primary/5 transition-all duration-500 group">
                                <div className="relative">
                                    <img src={footerSettings.qr_image} alt="Data Fiscal" className="h-28 w-28 object-contain rounded-xl" />
                                    <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="hidden sm:flex flex-col gap-1">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{footerSettings.column_4_title || 'AFIP - DATA FISCAL'}</p>
                                    <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">Comprobante Oficial de Registro</p>
                                    <div className="h-1 w-12 bg-primary rounded-full mt-1"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Row: Description and Socials */}
                <div className="flex flex-col lg:flex-row items-center justify-between pt-10 border-t border-gray-300 dark:border-white/10 gap-8">
                    <div className="max-w-xl">
                        <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium leading-relaxed text-center lg:text-left">
                            {footerSettings.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="flex items-center gap-6 mr-4">
                            {footerSettings.facebook_url !== '#' && (
                                <a href={footerSettings.facebook_url} target="_blank" rel="noreferrer" className="p-3 bg-white dark:bg-white/5 rounded-full text-slate-400 hover:text-primary hover:scale-110 transition-all shadow-sm border border-gray-100 dark:border-white/5">
                                    <Globe size={20} />
                                </a>
                            )}
                            {footerSettings.instagram_url !== '#' && (
                                <a href={footerSettings.instagram_url} target="_blank" rel="noreferrer" className="p-3 bg-white dark:bg-white/5 rounded-full text-slate-400 hover:text-primary hover:scale-110 transition-all shadow-sm border border-gray-100 dark:border-white/5">
                                    <Instagram size={20} />
                                </a>
                            )}
                        </div>

                        <div className="flex items-center gap-3 py-2 px-4 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.2em]">Sistemas Operativos</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
