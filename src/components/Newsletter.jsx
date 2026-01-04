import React from 'react';
import { Mail } from 'lucide-react';

const Newsletter = () => {
    return (
        <section className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-primary-dark to-slate-900 px-6 py-12 md:p-16 text-center shadow-2xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-purple rounded-full blur-[100px] opacity-30"></div>

            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
                <div className="size-16 rounded-2xl bg-white/10 backdrop-blur-lg flex items-center justify-center border border-white/20 shadow-lg mb-2">
                    <Mail size={32} className="text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                    No te pierdas lo importante.
                </h2>
                <p className="text-lg text-slate-300">
                    Recibe un resumen diario de las noticias que realmente importan, directo a tu bandeja de entrada. Sin spam, solo contenido curado.
                </p>
                <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-4" onSubmit={(e) => e.preventDefault()}>
                    <input
                        className="flex-1 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-accent-green focus:border-transparent px-5 py-3 outline-none backdrop-blur-sm transition-all"
                        placeholder="tu@email.com"
                        type="email"
                    />
                    <button className="px-8 py-3 bg-white text-primary font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform duration-200" type="submit">
                        Suscribirme
                    </button>
                </form>
                <p className="text-xs text-slate-400 mt-2">Únete a más de 50,000 lectores informados.</p>
            </div>
        </section>
    );
};

export default Newsletter;
