// app/catalogo/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import React from "react";

export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    // Si la ruta incluye 'retro-tv', no mostramos el sidebar del catálogo
    const isRetroTv = pathname.includes('retro-tv');

    if (isRetroTv) {
        return <>{children}</>;
    }

    return (
        <section className="flex bg-[#050508] min-h-screen relative overflow-hidden">
            {/* Luz de ambiente general para el catálogo */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-900/10 blur-[150px] pointer-events-none z-0"></div>

            <aside className="w-64 p-6 border-r border-cyan-500/30 bg-[#0a0a0f]/80 backdrop-blur-md shadow-[4px_0_30px_rgba(6,182,212,0.1)] relative z-20 flex flex-col">
                <h2 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-2xl tracking-widest mb-10 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)] uppercase border-b border-fuchsia-900/30 pb-4">
                    Catálogo
                </h2>
                
                <nav className="flex flex-col gap-4 flex-1">
                    <button className="group text-left px-4 py-3 text-gray-400 font-mono text-sm uppercase tracking-widest rounded border border-transparent hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-950/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300">
                        <span className="mr-3 opacity-50 group-hover:opacity-100 group-hover:drop-shadow-[0_0_5px_rgba(34,211,238,1)] transition-all">🕹️</span> 
                        Consolas
                    </button>
                    
                    <button className="group text-left px-4 py-3 text-gray-400 font-mono text-sm uppercase tracking-widest rounded border border-transparent hover:border-fuchsia-500/50 hover:text-fuchsia-400 hover:bg-fuchsia-950/30 hover:shadow-[0_0_15px_rgba(217,70,239,0.2)] transition-all duration-300">
                        <span className="mr-3 opacity-50 group-hover:opacity-100 group-hover:drop-shadow-[0_0_5px_rgba(217,70,239,1)] transition-all">💿</span> 
                        Juegos
                    </button>
                    
                    <button className="group text-left px-4 py-3 text-gray-400 font-mono text-sm uppercase tracking-widest rounded border border-transparent hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-950/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300">
                        <span className="mr-3 opacity-50 group-hover:opacity-100 group-hover:drop-shadow-[0_0_5px_rgba(168,85,247,1)] transition-all">🔌</span> 
                        Accesorios
                    </button>
                </nav>

                {/* Decoración cyberpunk en la parte inferior del menú */}
                <div className="mt-auto border-t border-cyan-900/50 pt-4">
                    <p className="text-[10px] text-cyan-700 font-mono text-center tracking-[0.2em] uppercase">
                        Sys. Nav // v2.0
                    </p>
                </div>
            </aside>
            
            <main className="flex-1 p-8 bg-transparent relative z-10 overflow-y-auto">
                {children}
            </main>
        </section>
    );
}