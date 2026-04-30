// app/retro-tv/components/VintageTV.tsx
'use client';

import { useRetroStore } from '@/app/lib/useRetroStore';
import { useDroppable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';

export default function VintageTV() {
  const { isOver, setNodeRef } = useDroppable({
    id: 'vintage-tv-dropzone',
  });

  const activeProduct = useRetroStore((state) => state.activeProduct);
  
  // Estados para controlar la TV
  const [isBooting, setIsBooting] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);

  // EFECTO MAESTRO: Lee el cartucho y busca en YouTube
  useEffect(() => {
    if (activeProduct) {
      setIsBooting(true);
      setVideoId(null); // Limpiamos el video anterior

      // 1. Buscamos el video en YouTube en segundo plano
      const fetchVideo = async () => {
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        const query = `${activeProduct.name} ${activeProduct.platform} retro commercial trailer`;
        
        console.log("Llave detectada:", apiKey ? "¡Sí hay llave!" : "No hay llave :(");

        try {
          if (!apiKey) throw new Error("No hay API Key");
          
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`
          );
          
          if (!response.ok) {
            console.error("Error de permisos de Google");
            throw new Error("Google rechazó la petición");
          }

          const data = await response.json();
          
          if (data.items && data.items.length > 0) {
            console.log("¡Video encontrado! ID:", data.items[0].id.videoId);
            setVideoId(data.items[0].id.videoId);
          } else {
            setVideoId('wRnSnfiUIgw'); // Comercial de Nintendo por defecto
          }
        } catch (error) {
          console.error('Error final en la búsqueda:', error);
          setVideoId('wRnSnfiUIgw'); // Fallback de emergencia
        }
      };

      fetchVideo();

      // 2. Apagamos la estática después de 1.5s
      const timer = setTimeout(() => {
        setIsBooting(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [activeProduct]);

  return (
    <div className="flex flex-col items-center relative z-20">
      
      {/* 1. LA RANURA DEL CARTUCHO */}
      <div className={`
        w-56 h-8 rounded-t-xl border-x-4 border-t-4 border-[#111] mx-auto relative z-10 transition-all duration-300 flex justify-center items-end pb-1
        ${isOver ? 'bg-fuchsia-600 shadow-[0_-15px_40px_rgba(217,70,239,0.8)] -translate-y-2' : 'bg-gray-900'}
      `}>
         <div className="w-48 h-3 bg-black rounded-full opacity-80 shadow-inner"></div>
      </div>

      {/* 2. LA CARCASA DE LA TV */}
      <div className="w-[550px] h-[400px] bg-[#222] p-6 rounded-3xl border-[12px] border-[#111] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative flex gap-4 z-20 -mt-2">
        
        {/* PANTALLA (Aquí es donde se suelta el cartucho) */}
        <div 
          ref={setNodeRef}
          className={`
            flex-1 h-full rounded-3xl overflow-hidden border-8 border-gray-950 relative
            transition-all duration-300 flex items-center justify-center bg-[#0a0a0a]
            ${isOver ? 'shadow-[inset_0_0_80px_rgba(6,182,212,0.8)]' : ''}
          `}
        >
          {/* Reflejo curvo del vidrio */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl pointer-events-none z-30" />

          {/* ESTADO A: TV VACÍA */}
          {!activeProduct ? (
             <div className="text-gray-600 font-mono text-xl flex flex-col items-center text-center opacity-40">
                <span className="text-5xl mb-4 text-gray-700">📺</span>
                <span>NO SIGNAL</span>
                {isOver && <span className="text-sm mt-4 text-cyan-400 animate-pulse">DROP TO INSERT</span>}
             </div>
          ) : 
          /* ESTADO B: ANIMACIÓN DE LECTURA (Booteo) */
          isBooting ? (
             <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 mix-blend-screen" 
                     style={{ backgroundImage: "url('https://media.giphy.com/media/YykpTIyeh1Fmw/giphy.gif')", backgroundSize: 'cover' }}>
                </div>
                <div className="h-1 w-full bg-white animate-pulse shadow-[0_0_30px_white]"></div>
                <p className="text-green-400 font-mono mt-6 animate-bounce z-10 font-bold bg-black/60 px-4 py-1 rounded border border-green-900/50 tracking-widest">
                  READING CARTRIDGE...
                </p>
             </div>
          ) : 
          /* ESTADO C: REPRODUCIENDO YOUTUBE */
          (
            videoId ? (
              <iframe
                className="w-full h-full object-cover scale-[1.35] z-10 pointer-events-none"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&disablekb=1&mute=0`}
                title="Retro Commercial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-red-500 font-mono text-sm z-10">ERROR DE SEÑAL</div>
            )
          )}

          {/* Capa de scanlines (Líneas de TV antigua) encima del video */}
          {activeProduct && !isBooting && (
             <div className="absolute inset-0 pointer-events-none z-20 opacity-20"
                  style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 50%)', backgroundSize: '100% 4px' }}>
             </div>
          )}
        </div>

        {/* PANEL DERECHO DE LA TV */}
        <div className="w-20 h-full flex flex-col justify-between py-8 items-center bg-[#1a1a1a] rounded-lg border-l-4 border-black shadow-inner">
           <div className="w-12 h-12 rounded-full bg-gray-900 border-4 border-gray-700 shadow-[0_4px_4px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-gray-800 transition-colors"></div>
           <div className="w-12 h-12 rounded-full bg-gray-900 border-4 border-gray-700 shadow-[0_4px_4px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-gray-800 transition-colors"></div>
           <div className="w-full flex flex-col gap-3 px-3 mt-auto">
             <div className="h-3 bg-black rounded-full w-full shadow-inner"></div>
             <div className="h-3 bg-black rounded-full w-full shadow-inner"></div>
             <div className="h-3 bg-black rounded-full w-full shadow-inner"></div>
           </div>
        </div>
      </div>
      
      {/* 3. CAJA DE TRIVIA */}
      <div className="mt-8 text-cyan-400 w-[550px] text-center min-h-[80px]">
        {activeProduct && !isBooting && (
          <div className="bg-slate-900/80 p-4 rounded-xl font-mono text-sm border border-cyan-800 shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-md transition-all animate-fade-in-up">
            <strong className="text-fuchsia-400 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)]">TRIVIA: </strong> 
            <span className="text-cyan-100">{activeProduct.trivia}</span>
          </div>
        )}
      </div>
    </div>
  );
}