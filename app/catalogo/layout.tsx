// app/catalogo/layout.tsx
'use client';

import { useRetroStore } from '@/app/lib/useRetroStore';
import { usePathname } from 'next/navigation';
import React from "react";
import Sidebar from './components/Sidebar';

export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const setCategoryFilter = useRetroStore((state) => state.setCategoryFilter);
    
    // 1. LÓGICA DE PROTECCIÓN: Analizamos la ruta actual
    // split('/') divide la ruta, y filter(Boolean) quita los espacios vacíos
    // Ej: "/catalogo/123" se convierte en ["catalogo", "123"] (longitud 2)
    const segments = pathname.split('/').filter(Boolean);
    
    // Si la longitud es mayor a 1, estamos en una sub-página (retro-tv o detalle de producto)
    const isSubPage = segments.length > 1;

    // Si es una sub-página, renderizamos el contenido completamente limpio, sin layout lateral
    if (isSubPage) {
        return <>{children}</>;
    }

    // 2. VISTA DE CATÁLOGO PRINCIPAL: Con Sidebar inyectado y comunicación activa
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