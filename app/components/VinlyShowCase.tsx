'use client';

import { useRef, useState } from "react";

//arreglo
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
    //estado
    const [playingId, setPlayingId] = useState<number | null>(null);

    //controles
    const audioRef = useRef<HTMLAudioElement | null>(null);

    //logica reproduccion
    const togglePlay = (vinilo: typeof vinilosData[0]) => {
        //si el audio no cargado no ejecutamos
        if (!audioRef.current) return;

        if (playingId === vinilo.id) {
            //pausamos
            audioRef.current.pause()
            setPlayingId(null)
        } else {
            //da clik a un nuevo disco
            audioRef.current.src = vinilo.audioSrc
            audioRef.current.play()
            setPlayingId(vinilo.id)
        }
    }

    return (
        <div className="w-full">
            {/* Reproductor invisible */}
            <audio ref={audioRef} onEnded={() => setPlayingId(null)} />
            
            {/* Cuadricula */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                {vinilosData.map((vinilo) => {
                    const isPlaying = playingId === vinilo.id;
                    
                    return (
                        <div
                            key={vinilo.id}
                            className="flex flex-col items-center cursor-pointer group"
                            onClick={() => togglePlay(vinilo)}
                        >
                            {/* CAJA PRINCIPAL RELATIVA */}
                            <div className="relative w-64 h-64 mb-6 flex justify-center items-center">
                                
                                {/* 1. EL VINILO (Gira y sale) */}
                                <div
                                    className={`absolute w-56 h-56 flex items-center justify-center transition-all duration-700 ease-in-out ${
                                        isPlaying ? 'translate-x-16 animate-[spin_3s_linear_infinite]' : 'translate-x-0'
                                    }`}
                                >
                                    {/* El disco negro base */}
                                    <img
                                        src="/images/vinilo-base2.png"
                                        alt="Disco de Vinilo"
                                        className="absolute w-full h-full object-contain drop-shadow-xl"
                                    />
                                    {/* Galleta */}
                                    <img
                                        src={vinilo.portada}
                                        alt="Galleta central"
                                        className="absolute w-20 h-20 rounded-full object-cover z-10 opacity-95"
                                    />
                                    {/* Hoyito */}
                                    <div className="absolute w-2 h-2 bg-zinc-900 rounded-full z-20"></div>
                                </div> {/* <--- CORREGIDO: Aquí debía cerrarse el vinilo, antes estaba abajo */}

                                {/* 2. LA PORTADA (Se mueve a la izquierda) */}
                                <div
                                    className={`absolute w-64 h-64 z-30 shadow-2xl transition-transform duration-700 ease-in-out ${
                                        isPlaying ? '-translate-x-8 scale-105' : 'translate-x-0 group-hover:scale-105'
                                    }`}
                                >
                                    <img
                                        src={vinilo.portada}
                                        alt={vinilo.album}
                                        className="w-full h-full object-cover rounded-sm border border-zinc-800"
                                    />
                                    {!isPlaying && (
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white pl-1 shadow-lg backdrop-blur-md">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 3. INFO PRODUCTO */}
                            <div className="text-center mt-4 z-10 transition-transform duration-300">
                                <h4 className={`text-xl font-black mb-1 transition-colors ${isPlaying ? 'text-orange-500' : 'text-zinc-900'}`}>
                                    {vinilo.album}
                                </h4>
                                <p className="text-zinc-500 font-medium mb-2">{vinilo.artista}</p>
                                <span className="text-lg font-bold text-zinc-900">${vinilo.precio.toFixed(2)}</span>
                            </div>
                            
                        </div>
                    );
                })}
            </div>
        </div>
    );
       

}