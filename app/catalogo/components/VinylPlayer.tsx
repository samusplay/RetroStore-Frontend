'use client';

import { useState } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";

interface VinylPlayerProps {
  productName: string;
  imageUrl: string;
  youtubeUrl?: string | null;
}

/**
 * Función Maestra: Extrae el ID del video y el tiempo de inicio (t= o start=)
 */
const extractYouTubeData = (url?: string | null) => {
  if (!url) return { id: null, startTime: 0 };

  // 1. Extraer ID (Soporta formatos cortos, largos, con parámetros, etc.)
  const idRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const idMatch = url.match(idRegExp);
  const id = (idMatch && idMatch[2].length === 11) ? idMatch[2] : null;

  // 2. Extraer Tiempo de inicio (&t= o ?t= o &start=)
  const timeMatch = url.match(/[?&](t|start)=(\d+)/);
  const startTime = timeMatch ? parseInt(timeMatch[2], 10) : 0;

  return { id, startTime };
};

export default function VinylPlayer({ productName, imageUrl, youtubeUrl }: VinylPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [isBuffering, setIsBuffering] = useState(false);

  // Extraemos los datos de la URL que viene de tu NestJS
  const { id: extractedId, startTime } = extractYouTubeData(youtubeUrl);
  
  // Si no hay ID, usamos el Rickroll como seguro, pero si hay, respetamos el startTime
  const videoId = extractedId || "dQw4w9WgXcQ"; 

  // CONFIGURACIÓN DINÁMICA DE LOS 15 SEGUNDOS
  const opts = {
    height: '0', 
    width: '0',
    playerVars: {
      autoplay: 0,
      controls: 0,
      start: startTime,         // El segundo exacto que pusiste en el link
      end: startTime + 15,      // Solo 15 segundos de gloria
      modestbranding: 1,
      rel: 0,
    },
  };

  const handleReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
  };

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
    } else {
      setIsBuffering(true);
      player.playVideo();
    }
  };

  const handleStateChange = (event: YouTubeEvent) => {
    // 1 = Playing, 2 = Paused, 0 = Ended, 3 = Buffering
    if (event.data === 1) { 
      setIsPlaying(true);
      setIsBuffering(false);
    } else if (event.data === 2 || event.data === 0) { 
      setIsPlaying(false);
      setIsBuffering(false);
    }
  };

  return (
    <div className="relative w-full flex flex-col justify-center items-center py-10">
      {/* YouTube Invisible - Motor de Audio */}
      <div className="hidden">
        <YouTube 
          videoId={videoId} 
          opts={opts} 
          onReady={handleReady} 
          onStateChange={handleStateChange} 
        />
      </div>

      <div className="flex flex-col items-center cursor-pointer relative" onClick={togglePlay}>
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 flex justify-center items-center">
          
          {/* 1. EL VINILO NEGRO (Gira con Glow Neón) */}
          <div className={`absolute w-[90%] h-[90%] flex items-center justify-center transition-all duration-[1500ms] ease-out z-0 ${
              isPlaying 
              ? 'translate-x-24 md:translate-x-32 animate-[spin_4s_linear_infinite] drop-shadow-[0_0_25px_rgba(217,70,239,0.5)]' 
              : 'translate-x-0 opacity-0 group-hover:translate-x-12 group-hover:opacity-100'
            }`}>
            <div className="absolute w-full h-full bg-[#0a0a0a] rounded-full border-[4px] border-[#1a1a1a] shadow-2xl flex items-center justify-center">
              <div className="absolute inset-0 rounded-full" style={{ backgroundImage: 'repeating-radial-gradient(circle, #222 0%, #0a0a0a 2%)', opacity: 0.4 }}></div>
              <img src={imageUrl} className="absolute w-1/3 h-1/3 rounded-full object-cover z-10 border-2 border-black" alt="center" />
              <div className="absolute w-3 h-3 bg-[#050508] rounded-full z-20 shadow-inner"></div>
            </div>
          </div>

          {/* 2. LA FUNDA / PORTADA */}
          <div className={`absolute w-full h-full z-30 transition-all duration-[1500ms] ease-out ${
              isPlaying 
              ? '-translate-x-12 scale-105 shadow-[0_0_40px_rgba(6,182,212,0.6)]' 
              : 'translate-x-0 group-hover:scale-105 shadow-2xl'
            }`}>
            <div className="relative w-full h-full p-1 bg-gradient-to-br from-gray-700 to-gray-900 rounded-sm">
              <img 
                src={imageUrl} 
                alt={productName} 
                className={`w-full h-full object-cover rounded-sm transition-all duration-700 ${isPlaying ? 'grayscale-0' : 'grayscale-[0.4] group-hover:grayscale-0'}`} 
              />
              
              {/* Botón Play / Spinner */}
              {!isPlaying && !isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-black/60 border-2 border-cyan-400 flex items-center justify-center text-cyan-400">
                    <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              )}
              {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {/* Indicador de "Playing" Neón */}
              {isPlaying && !isBuffering && (
                <div className="absolute top-3 right-3 flex gap-1 bg-black/70 p-2.5 rounded-md border border-cyan-500/50">
                  <div className="w-1.5 h-4 bg-fuchsia-400 animate-bounce"></div>
                  <div className="w-1.5 h-4 bg-fuchsia-400 animate-[bounce_1.2s_infinite]"></div>
                  <div className="w-1.5 h-4 bg-fuchsia-400 animate-[bounce_0.8s_infinite]"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mensaje dinámico */}
        <p className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest animate-pulse">
           {isBuffering ? "Conectando_Satelite..." : isPlaying ? ">>> Audio_Stream_Active" : "Click_To_Preview_Relic"}
        </p>
      </div>
    </div>
  );
}