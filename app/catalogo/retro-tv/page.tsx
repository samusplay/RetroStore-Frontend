// app/retro-tv/page.tsx
'use client';

import { DndContext, DragEndEvent } from '@dnd-kit/core';

import GameCartridge from './components/GameCartridge';
import VintageTV from './components/VintageTV';
// Ajusta esta ruta si MOCK_GAMES se quedó en la carpeta catalogo
import { MOCK_GAMES } from '@/app/catalogo/data/mockProducts';
import { useRetroStore } from '@/app/lib/useRetroStore';

export default function RetroRoomPage() {
  const { setActiveProduct, setIsDragging } = useRetroStore();

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;
    if (over && over.id === 'vintage-tv-dropzone') {
      const draggedGame = active.data.current;
      if (draggedGame) setActiveProduct(draggedGame as any);
    }
  };

  return (
    <DndContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
      <div className="relative w-full h-screen bg-[#09090e] overflow-hidden flex items-center justify-center font-sans">
        
        {/* FONDO OSCURO Y EFECTO DE LUZ TRASERA */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,20,70,0.6)_0%,rgba(5,5,15,1)_100%)] z-0"></div>

        {/* PISO DE CUADRÍCULA NEÓN (Estilo Synthwave) */}
        <div className="absolute bottom-0 w-[200%] h-1/2 -ml-[50%] z-0 opacity-40 pointer-events-none"
             style={{ 
               backgroundImage: 'linear-gradient(rgba(236,72,153,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(236,72,153,0.8) 1px, transparent 1px)', 
               backgroundSize: '40px 40px', 
               transform: 'perspective(600px) rotateX(75deg) translateY(50px)',
               boxShadow: 'inset 0 100px 100px #09090e' // Difumina el horizonte
             }}>
        </div>

        {/* --- LOS POSTERS CON LUZ DE NEÓN --- */}
        {/* Poster Izquierda Arriba */}
        <div className="absolute top-10 left-16 w-44 h-60 border-2 border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.6)] rotate-[-6deg] hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-300 z-10">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2XYiS4EnPM6H5gAvI6c9Oe1IzayjV30MjPA&s" alt="Cyberpunk Poster" className="w-full h-full object-cover" />
        </div>
        
        {/* Poster Izquierda Abajo */}
        <div className="absolute bottom-32 left-10 w-40 h-56 border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.6)] rotate-[4deg] hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-300 z-10">
            <img src="https://www.posterist.co.uk/cdn/shop/files/akira-poster-v3-01.jpg?v=1698399557" alt="Arcade Poster" className="w-full h-full object-cover" />
        </div>

        {/* Poster Derecha Arriba */}
        <div className="absolute top-16 right-[25%] w-36 h-52 border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] rotate-[8deg] hover:rotate-0 hover:scale-110 transition-all duration-300 z-10">
            <img src="https://m.media-amazon.com/images/I/612F8bfniwL._AC_UF894,1000_QL80_.jpg" alt="Zelda Poster" className="w-full h-full object-cover" />
        </div>

        {/* --- CENTRO EXACTO: LA TV --- */}
        <div className="z-20 relative group scale-110 mt-8">
          {/* Aura de neón detrás de la TV */}
          <div className="absolute -inset-10 bg-gradient-to-r from-cyan-500 via-purple-500 to-fuchsia-500 blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none rounded-full"></div>
          <VintageTV />
        </div>

        {/* --- DERECHA: LA ESTANTERÍA NEÓN FLOTANTE --- */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-72 h-[600px] bg-slate-900/80 backdrop-blur-md border-2 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4),inset_0_0_20px_rgba(6,182,212,0.2)] rounded-lg flex flex-col items-center z-30 overflow-hidden">
          
          {/* Cabecera de la estantería */}
          <div className="w-full h-14 bg-slate-950/90 flex justify-center items-center border-b-2 border-cyan-500 shadow-[0_5px_15px_rgba(6,182,212,0.3)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-black text-lg tracking-[0.3em] uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
              INVENTORY
            </span>
          </div>
          
          {/* Zona de cartuchos */}
          <div className="flex flex-col gap-6 p-6 overflow-y-auto w-full items-center custom-scrollbar pb-10">
            {MOCK_GAMES.map((game) => (
              <div key={game.id} className="relative group/cartridge hover:-translate-x-3 transition-transform duration-300">
                {/* Resplandor individual para cada cartucho */}
                <div className="absolute -inset-2 bg-fuchsia-500/0 group-hover/cartridge:bg-fuchsia-500/20 blur-md rounded transition-all"></div>
                <div className="relative z-10">
                  <GameCartridge game={game} />
                </div>
              </div>
            ))}
          </div>

          {/* Línea de neón decorativa abajo */}
          <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 shadow-[0_-5px_20px_rgba(236,72,153,0.8)]"></div>
        </div>

      </div>
    </DndContext>
  );
}