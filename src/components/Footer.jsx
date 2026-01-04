import React from 'react';
import { Newspaper, Globe, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="max-w-[1440px] mx-auto px-4 lg:px-8 border-t border-gray-200 dark:border-white/10 pt-12 pb-8 mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
                <div className="col-span-2 lg:col-span-2 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Newspaper className="text-primary" size={30} />
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">Compromiso Diario</h2>
                    </div>
                    <p className="text-slate-500 text-sm max-w-xs">
                        Periodismo moderno para la generación digital. Rápido, veraz y visualmente impactante.
                    </p>
                    <div className="flex gap-4 mt-2">
                        <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Globe size={20} /></a>
                        <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Instagram size={20} /></a>
                        <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Youtube size={20} /></a>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <h4 className="font-bold text-slate-900 dark:text-white">Secciones</h4>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Actualidad</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Tecnología</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Deportes</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Opinión</a>
                </div>

                <div className="flex flex-col gap-3">
                    <h4 className="font-bold text-slate-900 dark:text-white">Compañía</h4>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Nosotros</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Carreras</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Publicidad</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Contacto</a>
                </div>

                <div className="flex flex-col gap-3">
                    <h4 className="font-bold text-slate-900 dark:text-white">Legal</h4>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Privacidad</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Términos</a>
                    <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Cookies</a>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200 dark:border-white/5 gap-4">
                <p className="text-xs text-slate-500">© {new Date().getFullYear()} Diario Digital Inc. Todos los derechos reservados.</p>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-slate-500 font-medium">Sistemas Operativos</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
