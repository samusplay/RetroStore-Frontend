// app/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-cyan-500/30 shadow-[0_4px_30px_rgba(6,182,212,0.15)]">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* EL LOGO RETRO NEÓN */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-fuchsia-600 text-white p-1.5 rounded-md shadow-[0_0_15px_rgba(217,70,239,0.8)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(217,70,239,1)] transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <circle cx="8" cy="12" r="2"/>
              <circle cx="16" cy="12" r="2"/>
              <path d="M11 12h2"/>
            </svg>
          </div>
          <div className="text-2xl font-black tracking-widest flex items-center gap-1">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-cyan-600 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">RETRO</span>
            <span className="text-fuchsia-500 font-light drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">STORE</span>
          </div>
        </Link>

        {/* NAVEGACIÓN CYBERPUNK */}
        <nav className="hidden md:flex gap-10 font-medium text-sm text-gray-400">
          <Link 
            href="/" 
            className={`transition-all hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] ${pathname === '/' ? 'text-cyan-400' : ''}`}
          >
            Inicio
          </Link>
          <Link 
            href="/catalogo" 
            className={`transition-all hover:text-fuchsia-400 hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] ${pathname.includes('/catalogo') && !pathname.includes('retro-tv') ? 'text-fuchsia-400' : ''}`}
          >
            Catálogo
          </Link>
          <Link 
            href="/catalogo/retro-tv" 
            className={`hover:text-purple-400 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] transition-all flex items-center gap-2 ${pathname.includes('retro-tv') ? 'text-purple-400' : ''}`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span> 
            Habitación
          </Link>
        </nav>

        {/* BOTÓN NEÓN */}
        <button className="bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.8)] px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300">
          Mi Colección
        </button>
      </div>
    </header>
  );
}