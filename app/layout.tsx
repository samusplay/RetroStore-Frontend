// app/layout.tsx

import { Inter } from 'next/font/google';
// 1. NUEVA SINTAXIS: Importamos Link de Next.js
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RetroStore | Elegancia Clásica',
  description: 'Catálogo premium de consolas, vinilos y moda de colección.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-white text-zinc-900 min-h-screen flex flex-col antialiased`}>
        
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            
            {/* 2. EL LOGO CON EL CASETE RETRO */}
            <Link href="/" className="flex items-center gap-3 group">
              {/* Ícono SVG de Casete en Naranja Retro */}
              <div className="bg-orange-500 text-white p-1.5 rounded-md shadow-sm group-hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <circle cx="8" cy="12" r="2"/>
                  <circle cx="16" cy="12" r="2"/>
                  <path d="M11 12h2"/>
                </svg>
              </div>
              <div className="text-2xl font-black tracking-tight flex items-center gap-1">
                <span className="text-zinc-900">RETRO</span>
                <span className="text-zinc-400 font-light">STORE</span>
              </div>
            </Link>

            {/* 3. NAVEGACIÓN CON HOVER RETRO */}
            <nav className="hidden md:flex gap-10 font-medium text-sm text-zinc-500">
              {/* Usamos Link en lugar de la etiqueta <a> */}
              <Link href="/" className="hover:text-orange-500 transition-colors">Inicio</Link>
              <Link href="/catalogo" className="hover:text-orange-500 transition-colors">Catálogo</Link>
              <Link href="#" className="hover:text-orange-500 transition-colors">Nosotros</Link>
            </nav>

            {/* BOTÓN ELEGANTE (Negro puro con un sutil brillo naranja al pasar el mouse) */}
            <button className="bg-zinc-900 hover:bg-orange-500 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 shadow-md">
              Mi Colección
            </button>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-zinc-100 py-12 mt-20">
          <div className="container mx-auto px-6 text-center text-zinc-400 text-sm flex flex-col items-center">
            {/* Un pequeño acento de color en el footer */}
            <div className="w-12 h-1 bg-orange-500 rounded-full mb-6 opacity-50"></div>
            <p>© 2026 RetroStore. Diseño y nostalgia.</p>
          </div>
        </footer>

      </body>
    </html>
  );
}