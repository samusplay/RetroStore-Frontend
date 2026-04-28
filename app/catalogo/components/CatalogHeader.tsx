// app/catalogo/components/CatalogHeader.tsx
'use client';

import { useRetroStore } from '@/app/lib/useRetroStore';

export default function CatalogHeader() {
  const categoryFilter = useRetroStore((state) => state.categoryFilter);

  return (
    <header className="relative mb-10 py-6 px-6 md:px-10 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-cyan-500/10 bg-black/20 backdrop-blur-sm">
      
      {/* Cuadrícula estilo Tron (Grid) de fondo */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.15)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Línea Neón Superior (Cyan) */}
      <div className="absolute top-0 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,1)]"></div>

      {/* Título Principal */}
      <h1 className={`
        relative z-10 text-4xl md:text-6xl font-black italic tracking-tight uppercase text-transparent bg-clip-text
        drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]
        
        {/* LA SOLUCIÓN: pr-2 para darle safe-zone al resplandor neón en la inclinación de la 'e' */}
        pr-2
      `}>
        <span className="bg-gradient-to-b from-white to-cyan-200 bg-clip-text">Market</span>
        <span className="bg-gradient-to-b from-fuchsia-400 to-fuchsia-600 bg-clip-text drop-shadow-[0_0_25px_rgba(217,70,239,0.8)]">Place</span>
      </h1>

      {/* Subtítulo Dinámico (Compacto) */}
      <div className="relative z-10 mt-4 flex items-center gap-3 bg-black/60 border border-cyan-500/30 px-5 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse shadow-[0_0_10px_rgba(217,70,239,1)]"></span>
        <p className="text-cyan-400 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em]">
          Mostrando: <span className="text-white font-bold">{categoryFilter}</span>
        </p>
      </div>

      {/* Línea Neón Inferior (Fuchsia) */}
      <div className="absolute bottom-0 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent shadow-[0_0_20px_rgba(217,70,239,1)]"></div>
      
      {/* Destellos en los bordes de las líneas */}
      <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-24 h-[8px] bg-cyan-400/50 blur-[8px] rounded-full"></div>
      <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-24 h-[8px] bg-fuchsia-500/50 blur-[8px] rounded-full"></div>
    </header>
  );
}