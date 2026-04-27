'use client';

import {
    Disc,
    Filter,
    Gamepad2,
    LayoutGrid
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface SidebarProps {
  onFilterChange: (category: string) => void;
}

export default function Sidebar({ onFilterChange }: SidebarProps) {
  // Criterio 5: Hook useState para el estado del filtro
  const [activeTab, setActiveTab] = useState('TODOS');

  // Criterio 13: Cargar el último filtro desde LocalStorage al iniciar
  useEffect(() => {
    const savedFilter = localStorage.getItem('retro_filter_pref');
    if (savedFilter) {
      setActiveTab(savedFilter);
      onFilterChange(savedFilter);
    }
  }, []);

  const categories = [
    { id: 'TODOS', label: 'Ver Todo', icon: LayoutGrid },
    { id: 'CONSOLAS', label: 'Consolas', icon: Gamepad2 },
    { id: 'JUEGOS', label: 'Videojuegos', icon: Disc },
    
  ];

  // Criterio 4: Función que genera un evento de cambio
  const handleFilterSelection = (id: string) => {
    setActiveTab(id);
    onFilterChange(id); // Comunicación hacia el padre (Criterio 3)
    localStorage.setItem('retro_filter_pref', id); // Persistencia (Criterio 13)
  };

  return (
    <aside className="w-72 h-[calc(100vh-80px)] sticky top-20 bg-[#0a0a0f]/90 backdrop-blur-xl border-r border-cyan-500/20 p-6 flex flex-col z-40">
      
      {/* Cabecera del Sidebar */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <Filter className="w-5 h-5 text-fuchsia-500" />
        <h2 className="text-white font-black text-sm uppercase tracking-[0.3em] italic">
          Data_Filter
        </h2>
      </div>

      {/* Navegación de Categorías (Criterio 10) */}
      <nav className="flex flex-col gap-3 flex-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          
          return (
            <button
              key={cat.id} // Criterio 8
              onClick={() => handleFilterSelection(cat.id)}
              className={`
                flex items-center gap-4 px-4 py-3.5 rounded-xl font-mono text-[11px] uppercase tracking-widest transition-all duration-300 group
                ${isActive 
                  ? 'bg-cyan-500/10 border border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
                  : 'text-gray-500 hover:text-gray-300 border border-transparent hover:bg-white/5'}
              `}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-gray-600'}`} />
              <span className="font-bold">{cat.label}</span>
              
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan] animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>

      

    </aside>
  );
}