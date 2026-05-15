'use client';

import { CollectionDrawer } from '@/app/catalogo/components/CollectionDrawer';
import { useAuthStore } from '@/app/lib/useAuthStore';
import { BookmarkPlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  const isSeller = hydrated && user?.role === 'SELLER';

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-cyan-500/30 shadow-[0_4px_30px_rgba(6,182,212,0.15)]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">

          {/* LOGO */}
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

          {/* NAV */}
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

            {isSeller && (
              <>
                <Link
                  href="/perfil"
                  className={`transition-all hover:text-orange-400 hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] font-bold flex items-center gap-2 ${pathname === '/perfil' ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Publicar
                </Link>

                <Link
                  href="/perfil/dashboard"
                  className={`transition-all hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] font-bold flex items-center gap-2 ${pathname === '/perfil/dashboard' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="7" height="9" x="3" y="3" rx="1"/>
                    <rect width="7" height="5" x="14" y="3" rx="1"/>
                    <rect width="7" height="9" x="14" y="12" rx="1"/>
                    <rect width="7" height="5" x="3" y="16" rx="1"/>
                  </svg>
                  Dashboard
                </Link>
              </>
            )}

            <Link
              href="/catalogo/retro-tv"
              className={`hover:text-purple-400 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] transition-all flex items-center gap-2 ${pathname.includes('retro-tv') ? 'text-purple-400' : ''}`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              Habitación
            </Link>
          </nav>

          {/* AUTH */}
          <div className="flex items-center gap-4 min-w-35 justify-end">
            {!hydrated ? (
              <div className="h-8 w-24 rounded-full bg-zinc-800/60 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-4">

                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-tighter">Conectado como</span>
                  <span className="text-sm font-bold text-white">{user.username}</span>
                  <span className={`text-[9px] font-mono uppercase tracking-widest ${isSeller ? 'text-fuchsia-400' : 'text-cyan-600'}`}>
                    {isSeller ? '⚡ Vendedor' : '🎮 Coleccionista'}
                  </span>
                </div>

                <div className="w-px h-8 bg-white/10" />

                <button
                  onClick={() => setDrawerOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-fuchsia-500/50 text-fuchsia-400 hover:bg-fuchsia-500/10 hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] text-sm font-bold transition-all duration-300"
                  title="Mi Colección"
                >
                  <BookmarkPlus size={16} />
                  <span className="hidden sm:inline">Mi Colección</span>
                </button>

                <div className="w-px h-8 bg-white/10" />

                <button
                  onClick={() => logout()}
                  className="p-2 rounded-full border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                  title="Cerrar Sesión"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>

              </div>
            ) : (
              <Link
                href="/login"
                className="bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.8)] px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300"
              >
                Log In
              </Link>
            )}
          </div>

        </div>
      </header>

      {hydrated && user && (
        <CollectionDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}