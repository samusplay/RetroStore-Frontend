// app/layout.tsx

import { Inter } from 'next/font/google';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RetroStore | Cyberpunk & Classics',
  description: 'Catálogo premium de consolas, vinilos y moda de colección.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      {/* Fondo oscuro absoluto para toda la web */}
      <body className={`${inter.className} bg-[#050508] text-gray-200 min-h-screen flex flex-col antialiased selection:bg-fuchsia-500 selection:text-white`}>
        
        <Header/>

        <main className="flex-1 relative z-10">
          {children}
        </main>

        {/* FOOTER RETRO */}
        <Footer/>

      </body>
    </html>
  );
}