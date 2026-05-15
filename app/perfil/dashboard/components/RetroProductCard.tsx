// app/perfil/dashboard/components/RetroProductCard.tsx
'use client';

import { useState, useTransition } from 'react';
import YouTube from 'react-youtube';
import { activateProductAction, deactivateProductAction } from '../../actions/update-product.action';
import EditProductModal from './EditProductModal';

interface RetroProductCardProps {
  product: any;
  onRefresh: () => void;
}

const extractYouTubeData = (url?: string | null) => {
  if (!url) return { id: null, startTime: 0 };
  const idRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const idMatch = url.match(idRegExp);
  const id = (idMatch && idMatch[2].length === 11) ? idMatch[2] : null;
  const timeMatch = url.match(/[?&](t|start)=(\d+)/);
  const startTime = timeMatch ? parseInt(timeMatch[2], 10) : 0;
  return { id, startTime };
};

export default function RetroProductCard({ product, onRefresh }: RetroProductCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isVinilo = product.category === 'VINILO';
  const { id: videoId, startTime } = extractYouTubeData(product.youtubeUrl);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!player || !product.isActive) return;
    if (isPlaying) player.pauseVideo();
    else {
      player.unMute();
      player.setVolume(100);
      player.playVideo();
    }
  };

  const togglePower = () => {
    startTransition(async () => {
      try {
        if (product.isActive) {
          if (player) player.pauseVideo();
          await deactivateProductAction(product.id);
        } else {
          await activateProductAction(product.id);
        }
        onRefresh();
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div className={`flex flex-col items-center group relative p-6 bg-[#0a0a0f]/90 border rounded-xl transition-all duration-500 
      ${product.isActive ? 'border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-gray-800'} 
      ${isPending ? 'opacity-50 scale-95' : 'scale-100'}`}>
      
      {/* Audio Invisible */}
      {isVinilo && videoId && (
        <div className="absolute opacity-0 pointer-events-none -z-50 w-0 h-0 overflow-hidden">
          <YouTube 
            videoId={videoId}
            opts={{ height: '0', width: '0', playerVars: { autoplay: 0, controls: 0, start: startTime, end: startTime + 15 } }}
            onReady={(e) => setPlayer(e.target)}
            onStateChange={(e) => setIsPlaying(e.data === 1)}
          />
        </div>
      )}

      {/* BADGE ONLINE/OFFLINE */}
      <div className={`absolute top-4 right-4 px-3 py-1 text-[10px] font-mono border rounded-sm z-50 ${
        product.isActive ? 'border-cyan-400 text-cyan-400 bg-cyan-900/20' : 'border-red-500 text-red-500 bg-red-900/10'
      }`}>
        {product.isActive ? 'ONLINE' : 'OFFLINE'}
      </div>

      {/* ÁREA INTERACTIVA */}
      <div className="relative w-48 h-48 mb-8 flex justify-center items-center mt-6 cursor-pointer" onClick={togglePlay}>
        {isVinilo && (
          <div className={`absolute w-44 h-44 flex items-center justify-center transition-all duration-[1000ms] ${
            isPlaying && product.isActive ? 'translate-x-20 animate-[spin_4s_linear_infinite] opacity-100' : 'translate-x-0 opacity-0'
          }`}>
            <div className="w-full h-full bg-[#111] rounded-full border-[4px] border-[#1a1a1a] shadow-2xl flex items-center justify-center">
              <div className="absolute inset-0 rounded-full" style={{ backgroundImage: 'repeating-radial-gradient(circle, #222 0%, #111 2%)', opacity: 0.3 }} />
              <div className="w-16 h-16 rounded-full bg-cyan-900 border-2 border-black z-10" />
            </div>
          </div>
        )}

        <div className={`absolute w-48 h-48 z-30 transition-all duration-700 ${
          isPlaying && product.isActive ? '-translate-x-10 scale-105 shadow-2xl' : 'scale-100'
        } ${!product.isActive && 'grayscale opacity-40'}`}>
          <div className="relative w-full h-full p-1 bg-gradient-to-br from-gray-700 to-gray-900 rounded-sm overflow-hidden border border-white/10">
            <img src={product.imageUrl || '/placeholder.png'} className="w-full h-full object-cover rounded-sm" alt={product.name} />
          </div>
        </div>
      </div>

      {/* INFO Y BOTONES */}
      <div className="text-center w-full z-40 font-mono">
        <h4 className={`text-xl font-black uppercase truncate px-2 ${product.isActive ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'text-gray-600'}`}>
          {product.name}
        </h4>
        
        <div className="flex justify-between items-center mt-8 px-2">
          <span className={`font-bold text-lg ${product.isActive ? 'text-white' : 'text-gray-700'}`}>
            ${Number(product.price).toFixed(2)}
          </span>

          <div className="flex gap-3">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
              className="p-3 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 rounded-sm transition-all"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); togglePower(); }}
              disabled={isPending}
              className={`p-3 border rounded-sm transition-all ${
                product.isActive ? 'border-red-500/50 text-red-500 hover:bg-red-500/20' : 'border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20'
              }`}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
            </button>
          </div>
        </div>
      </div>

      <EditProductModal 
        product={product} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={onRefresh}
      />
    </div>
  );
}