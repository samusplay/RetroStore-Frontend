// app/page.tsx
import BrandCarrusel from "./components/BrandCarrusel";
import Gallery from "./components/Gallery";
import VinlyShowCase from "./components/VinlyShowCase";
import VintageForm from "./components/VintageForm";
import { verifcationTest } from "./config/cloudinary";

export default async function Home() {
  await verifcationTest();
  return (
    <div className="flex flex-col w-full bg-[#050508] overflow-hidden">
      
      {/* 1. HERO SECTION (Modo Synthwave) */}
      <section className="relative pt-24 pb-16 md:pt-40 md:pb-32 text-center px-6 overflow-hidden">
        {/* Cuadrícula láser de fondo */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
             style={{ 
               backgroundImage: 'linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)', 
               backgroundSize: '50px 50px', 
               transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)'
             }}>
        </div>
        {/* Resplandor central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-fuchsia-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <div className="relative z-10">
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 drop-shadow-lg">
            La nostalgia,
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-500 to-purple-600 drop-shadow-[0_0_15px_rgba(217,70,239,0.4)]">ahora de colección.</span>
            </h1>
            <p className="text-lg md:text-xl text-cyan-100/70 max-w-2xl mx-auto font-medium mb-12 leading-relaxed">
            Consolas clásicas, vinilos originales y moda Y2K. Restaurados con
            amor, probados y listos para volver a tus manos.
            </p>
            <div className="flex justify-center gap-6">
            <button className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-10 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(217,70,239,0.6)] hover:shadow-[0_0_35px_rgba(217,70,239,0.9)] hover:scale-105 uppercase tracking-widest text-sm">
                Entrar al Arcade
            </button>
            </div>
        </div>
      </section>

      {/* 2. CARRUSEL DE MARCAS */}
      <section className="w-full py-12 border-y border-cyan-900/30 bg-black/40 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6">
          <h3 className="text-center text-xs font-bold tracking-[0.3em] text-cyan-500 uppercase mb-8 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
            Sistemas Compatibles
          </h3>
          <div className="opacity-70 hover:opacity-100 transition-opacity duration-300 filter invert brightness-0 hover:filter-none">
            {/* Nota: Tal vez necesites ajustar BrandCarrusel si las imágenes son oscuras */}
            <BrandCarrusel />
          </div>
        </div>
      </section>

      {/* 3. GALERÍA CON EVENTOS */}
      <section className="py-24 w-full bg-[#0a0a0f] border-b border-fuchsia-900/20 relative z-10">
        <div className="container mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className="text-fuchsia-500 font-bold tracking-[0.2em] text-sm uppercase mb-3 block drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]">
              High Score Drops
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              Tesoros de la Semana
            </h2>
            <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto">
              Explora nuestra selección de piezas más cotizadas. Haz clic en cada miniatura para descubrir los detalles de estas reliquias antes de que desaparezcan.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto rounded-xl p-1 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <Gallery />
          </div>

        </div>
      </section>
      
      {/* 4. CATÁLOGO LISTA */}
      <section className="py-24 container mx-auto px-6 bg-[#050508] relative z-10">
        <div className="flex justify-between items-end mb-16 border-b border-cyan-900/30 pb-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              Analog Sound
            </h2>
            <p className="text-cyan-400 mt-2 text-lg font-mono">
              &gt; Cargando pistas de audio...
            </p>
          </div>
          <button className="hidden md:block text-fuchsia-500 font-bold hover:text-fuchsia-300 hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] transition-all uppercase tracking-widest text-sm">
            Ver todo_
          </button>
        </div>
        
        <div className="w-full">
          <VinlyShowCase />
        </div>
      </section>
      
      {/* 5. CAPTURAR LEADS */}
      <section className="py-32 w-full bg-[#0a0a0f] border-t border-fuchsia-600/30 relative z-10 overflow-hidden">
        {/* Luz de fondo en el formulario */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-cyan-600/10 blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-6 flex justify-center items-center relative z-10">
          <div className="w-full flex justify-center items-center transform md:scale-110 drop-shadow-[0_0_20px_rgba(217,70,239,0.15)]">
            {/* Nota: Quizás debas hacer ajustes dentro de VintageForm para que combine */}
            <VintageForm />
          </div>
        </div>
      </section>
    </div>
  );
}