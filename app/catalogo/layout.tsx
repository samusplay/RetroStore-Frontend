// app/catalogo/layout.tsx
'use client';

import { useRetroStore } from '@/app/lib/useRetroStore'; // Importamos el store para la comunicación
import { usePathname } from 'next/navigation';
import React from "react";
import Sidebar from './components/Sidebar'; // Importamos el componente que creamos

export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const setCategoryFilter = useRetroStore((state) => state.setCategoryFilter);
    
    // 1. LÓGICA DE PROTECCIÓN: Si es retro-tv, devolvemos solo los hijos (Criterio 3)
    const isRetroTv = pathname.includes('retro-tv');

    if (isRetroTv) {
        return <>{children}</>;
    }

    // 2. VISTA DE CATÁLOGO: Con Sidebar inyectado y comunicación activa
    return (
        <section className="flex bg-[#050508] min-h-screen relative overflow-hidden">
            {/* Luz de ambiente general para el catálogo */}
            <div className="absolute top-0 left-1/4 w-150 h-150 bg-cyan-900/10 blur-[150px] pointer-events-none z-0"></div>

            {/* INYECCIÓN DEL COMPONENTE SIDEBAR (Criterio 3 y 4) */}
            {/* Le pasamos la función del Store para que el Sidebar le hable al Catálogo */}
            <Sidebar onFilterChange={(category) => setCategoryFilter(category)} />
            
            <main className="flex-1 p-8 bg-transparent relative z-10 overflow-y-auto">
                {children}
            </main>
        </section>
    );
}