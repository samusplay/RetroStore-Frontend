'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-[#050508]/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="text-2xl font-black tracking-tight flex items-center gap-1">
            <span className="text-cyan-400">RETRO</span>
            <span className="text-gray-400 font-light">STORE</span>
          </div>
        </Link>

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

        <div className="flex items-center gap-3">
          <button className="bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.8)] px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300">
            Mi Colección
          </button>
          <Link
            href="/payments"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-300"
            style={{
              color: '#00F5FF',
              border: '1px solid #00F5FF',
              boxShadow: '0 0 10px rgba(0,245,255,0.3)',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Comprar
          </Link>
        </div>
      </div>
    </header>
  );
}
