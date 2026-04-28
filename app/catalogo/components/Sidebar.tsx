'use client';

import {
  ChevronLeft,
  ChevronRight,
  Disc,
  Filter,
  Gamepad2,
  LayoutGrid,
  Shirt
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface SidebarProps {
  onFilterChange: (category: string) => void;
}

export default function Sidebar({ onFilterChange }: SidebarProps) {
  const [activeTab, setActiveTab] = useState('TODOS');
  // NUEVO ESTADO: Controla si el sidebar está abierto o cerrado
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const savedFilter = localStorage.getItem('retro_filter_pref');
    if (savedFilter) {
      setActiveTab(savedFilter);
      onFilterChange(savedFilter);
    }
  }, []);

 const categories = [
    { id: 'TODOS', label: 'Ver Todo', icon: LayoutGrid },
    { id: 'VIDEOJUEGO', label: 'Videojuegos', icon: Gamepad2 },
    { id: 'VINILO', label: 'Vinilos', icon: Disc },
    { id: 'ROPA', label: 'Ropa', icon: Shirt },
  ];

  const handleFilterSelection = (id: string) => {
    setActiveTab(id);
    onFilterChange(id); 
    localStorage.setItem('retro_filter_pref', id); 
  };

  return (
    <aside 
      className={`
        relative h-[calc(100vh-80px)] sticky top-20 bg-[#0a0a0f]/90 backdrop-blur-xl border-r border-cyan-500/20 
        transition-all duration-300 ease-in-out flex flex-col z-40
        ${isCollapsed ? 'w-24 p-4' : 'w-72 p-6'}
      `}
    >
      
      {/* BOTÓN COLAPSABLE (Flotante en el borde) */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-8 bg-black border border-cyan-500/50 text-cyan-400 p-1.5 rounded-full hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_cyan] transition-all z-50"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Cabecera del Sidebar */}
      <div className={`flex items-center mb-10 ${isCollapsed ? 'justify-center' : 'gap-3 px-2'}`}>
        <Filter className="w-5 h-5 text-fuchsia-500 shrink-0" />
        {!isCollapsed && (
          <h2 className="text-white font-black text-sm uppercase tracking-[0.3em] italic whitespace-nowrap overflow-hidden">
            Data_Filter
          </h2>
        )}
      </div>

      {/* Navegación de Categorías */}
      <nav className="flex flex-col gap-3 flex-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => handleFilterSelection(cat.id)}
              title={isCollapsed ? cat.label : undefined} // Muestra tooltip nativo si está colapsado
              className={`
                flex items-center rounded-xl font-mono text-[11px] uppercase tracking-widest transition-all duration-300 group overflow-hidden
                ${isCollapsed ? 'justify-center p-3.5' : 'gap-4 px-4 py-3.5'}
                ${isActive 
                  ? 'bg-cyan-500/10 border border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
                  : 'text-gray-500 hover:text-gray-300 border border-transparent hover:bg-white/5'}
              `}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-gray-600'}`} />
              
              {!isCollapsed && (
                <span className="font-bold whitespace-nowrap">{cat.label}</span>
              )}
              
              {isActive && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan] animate-pulse shrink-0"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Debugger de LocalStorage (Se oculta suavemente al colapsar) */}
     

    </aside>
  );
}