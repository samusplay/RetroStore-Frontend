// app/retro-tv/components/VinlyShowCase.tsx
'use client';

import { useRef, useState } from "react";

const vinilosData = [
    {
        id: 1,
        artista: "a-ha",
        album: "Hunting High and Low",
        precio: 35.00,
        portada: "/images/aha-cover.png",
        audioSrc: "/audio/take-on-me.mp3",
    },
    {
        id: 2,
        artista: "Queen",
        album: "News of the World",
        precio: 65.00,
        portada: "/images/queen-cover.png",
        audioSrc: "/audio/queen.mp3",
    },
    {
        id: 3,
        artista: "Berlin",
        album: "Top Gun Soundtrack",
        precio: 45.00,
        portada: "/images/berlin-cover.png",
        audioSrc: "/audio/berlin.mp3",
    }
];

export default function VinlyShowCase() {
    const [playingId, setPlayingId] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = (vinilo: typeof vinilosData[0]) => {
        if (!audioRef.current) return;

        if (playingId === vinilo.id) {
            audioRef.current.pause();
            setPlayingId(null);
        } else {
            audioRef.current.src = vinilo.audioSrc;
            audioRef.current.play();
            setPlayingId(vinilo.id);
        }
    }

    return (
        <div className="w-full py-12">
            {/* Reproductor invisible */}
            <audio ref={audioRef} onEnded={() => setPlayingId(null)} />
            
            {/* Cuadrícula de Discos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto px-6">
                {vinilosData.map((vinilo) => {
                    const isPlaying = playingId === vinilo.id;
                    
                    return (
                        <div
                            key={vinilo.id}
                            className="flex flex-col items-center cursor-pointer group"
                            onClick={() => togglePlay(vinilo)}
                        >
                            {/* CONTENEDOR DEL DISCO */}
                            <div className="relative w-64 h-64 mb-8 flex justify-center items-center">
                                
                                {/* 1. EL VINILO NEGRO (Gira con Glow Neón) */}
                                <div
                                    className={`absolute w-60 h-60 flex items-center justify-center transition-all duration-700 ease-in-out ${
                                        isPlaying 
                                        ? 'translate-x-20 animate-[spin_4s_linear_infinite] drop-shadow-[0_0_25px_rgba(6,182,212,0.5)]' 
                                        : 'translate-x-0 opacity-40 group-hover:translate-x-10 group-hover:opacity-100'
                                    }`}
                                >
                                    {/* Disco base con texturizado circular */}
                                    <div className="absolute w-full h-full bg-[#111] rounded-full border-[6px] border-[#1a1a1a] shadow-2xl flex items-center justify-center">
                                        <div className="absolute inset-0 rounded-full" 
                                             style={{ backgroundImage: 'repeating-radial-gradient(circle, #222 0%, #111 2%)', opacity: 0.3 }}>
                                        </div>
                                    </div>

                                    {/* Galleta Central (Portada pequeña) */}
                                    <img
                                        src={vinilo.portada}
                                        alt="Galleta central"
                                        className="absolute w-24 h-24 rounded-full object-cover z-10 border-2 border-[#111]"
                                    />
                                    {/* Hoyito central */}
                                    <div className="absolute w-3 h-3 bg-[#050508] rounded-full z-20 shadow-inner"></div>
                                </div>

                                {/* 2. LA FUNDA / PORTADA */}
                                <div
                                    className={`absolute w-64 h-64 z-30 transition-all duration-700 ease-in-out ${
                                        isPlaying 
                                        ? '-translate-x-12 scale-105 shadow-[0_0_30px_rgba(0,0,0,0.8)]' 
                                        : 'translate-x-0 group-hover:scale-105 shadow-xl'
                                    }`}
                                >
                                    <div className="relative w-full h-full p-1 bg-linear-to-br from-gray-700 to-gray-900 rounded-sm">
                                        <img
                                            src={vinilo.portada}
                                            alt={vinilo.album}
                                            className="w-full h-full object-cover rounded-sm grayscale-[0.2] group-hover:grayscale-0 transition-all"
                                        />
                                        {/* Overlay de reproducción */}
                                        {!isPlaying && (
                                            <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                                                <div className="w-16 h-16 rounded-full bg-black/80 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                </div>
                                            </div>
                                        )}
                                        {/* Indicador de "Playing" Neón */}
                                        {isPlaying && (
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                <div className="w-1 h-3 bg-cyan-400 animate-bounce"></div>
                                                <div className="w-1 h-3 bg-cyan-400 animate-[bounce_1.2s_infinite]"></div>
                                                <div className="w-1 h-3 bg-cyan-400 animate-[bounce_0.8s_infinite]"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 3. INFO DEL PRODUCTO (LETRAS CORREGIDAS) */}
                            <div className="text-center relative z-40">
                                <h4 className={`text-2xl font-black tracking-tighter uppercase transition-all duration-300 ${
                                    isPlaying ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-white'
                                }`}>
                                    {vinilo.album}
                                </h4>
                                <p className="text-fuchsia-500 font-mono text-xs uppercase tracking-[0.3em] mt-1 mb-3">
                                    {vinilo.artista}
                                </p>
                                <div className="inline-block px-4 py-1 border border-cyan-500/30 rounded-full bg-cyan-500/5">
                                    <span className="text-lg font-bold text-gray-400 font-mono">
                                        PRICE: <span className="text-white">${vinilo.precio.toFixed(2)}</span>
                                    </span>
                                </div>
                            </div>
                            
                        </div>
                    );
                })}
            </div>
        </div>
    );
}