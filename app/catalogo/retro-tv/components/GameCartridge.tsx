'use client';

import { useDraggable } from '@dnd-kit/core';
import Image from 'next/image';
import { RetroProduct } from '../../schemas/retro.schema';
 // Ajusta la ruta a tu esquema

interface GameCartridgeProps {
  game: RetroProduct;
}
//convertimos en un objeto arrastable
export default function GameCartridge({ game }: GameCartridgeProps) {
  // 1. Inicializamos la lógica de arrastre
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: game.id,
    data: game, // Guardamos toda la info del juego dentro del evento de arrastre
  });

  // 2. Si el usuario lo está moviendo, aplicamos la transformación CSS
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 1, // Para que el cartucho pase por encima de todo
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative w-48 h-32 bg-gray-300 rounded-t-lg rounded-b-sm border-4 border-gray-400 
        shadow-md cursor-grab active:cursor-grabbing flex flex-col items-center justify-center p-2
        transition-opacity hover:bg-gray-200
        ${isDragging ? 'opacity-80 shadow-2xl scale-105 rotate-2' : 'opacity-100'}
      `}
    >
      {/* La hendidura superior del cartucho (Puro diseño CSS) */}
      <div className="absolute top-0 w-32 h-2 bg-gray-400 rounded-b-full opacity-50"></div>

      {/* La etiqueta del juego con la imagen */}
      <div className="relative w-full h-full bg-black rounded border-2 border-gray-500 overflow-hidden pointer-events-none">
        <Image 
          src={game.imageUrl} 
          alt={game.name} 
          fill
          className="object-cover opacity-90"
          sizes="(max-width: 768px) 100vw, 200px"
        />
        <div className="absolute bottom-0 w-full bg-black/70 text-white text-[10px] text-center font-bold py-1 truncate px-1">
          {game.name}
        </div>
      </div>
    </div>
  );
}