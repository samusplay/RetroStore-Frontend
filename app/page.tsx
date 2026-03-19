import BrandCarrusel from "./components/BrandCarrusel";
import Gallery from "./components/Gallery";
import VinlyShowCase from "./components/VinlyShowCase";
import VintageForm from "./components/VintageForm";
import { verifcationTest } from "./config/cloudinary";

export default async function Home() {
  await verifcationTest();
  return (
    <div className="flex flex-col w-full bg-white">
      
      {/* 1. HERO SECTION (Intacta) */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 text-center px-6">
        <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter mb-6">
          La nostalgia,
          <br />
          <span className="text-zinc-400 font-light">ahora de colección.</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto font-medium mb-10 leading-relaxed">
          Consolas clásicas, vinilos originales y moda Y2K. Restaurados con
          amor, probados y listos para volver a tus manos.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-zinc-900 hover:bg-orange-500 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg">
            Ver Catálogo
          </button>
        </div>
      </section>

      {/* 2. CARRUSEL DE MARCAS (Diseño Mejorado) */}
      <section className="w-full py-12 border-y border-zinc-100 bg-white">
        <div className="container mx-auto px-6">
          <h3 className="text-center text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-8">
            Marcas clásicas restauradas
          </h3>
          {/* El carrusel ahora respira mejor con márgenes ajustados */}
          <div className="opacity-80 hover:opacity-100 transition-opacity duration-300">
            <BrandCarrusel />
          </div>
        </div>
      </section>

      {/* 3. GALERÍA CON EVENTOS (Diseño Mejorado y Expandido) */}
      {/* Añadimos bg-zinc-50 para que la tarjeta blanca del componente resalte */}
      <section className="py-24 w-full bg-zinc-50 border-b border-zinc-100">
        <div className="container mx-auto px-6">
          
          {/* Textos con mejor jerarquía y estilo premium */}
         <div className="text-center mb-14">
            <span className="text-orange-500 font-bold tracking-wider text-sm uppercase mb-3 block">
              Colección Premium
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">
              Tesoros de la Semana
            </h2>
            <p className="text-zinc-500 mt-4 text-lg max-w-2xl mx-auto">
              Explora nuestra selección de piezas más cotizadas. Haz clic en cada miniatura para descubrir los detalles de estas reliquias antes de que desaparezcan.
            </p>
          </div>
          
          {/* Contenedor ancho (max-w-6xl) para asegurar que el componente se acomode horizontalmente */}
          <div className="max-w-6xl mx-auto">
            <Gallery />
          </div>

        </div>
      </section>
      
      {/* 4. CATÁLOGO LISTA (Intacta) */}
      <section className="py-24 container mx-auto px-6 bg-white">
        <div className="flex justify-between items-end mb-16 border-b border-zinc-100 pb-6">
          <div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
              Tu música favorita en vinilo
            </h2>
            <p className="text-zinc-500 mt-2 text-lg">
              Haz clic en la portada, sube el volumen y revive los clásicos.
            </p>
          </div>
          <button className="hidden md:block text-orange-500 font-bold hover:text-zinc-900 transition-colors">
            Ver todo →
          </button>
        </div>
        
        {/* ¡ADIÓS A LA CAJA GRIS! 
          Quitamos el border-dashed y el h-64 para que el VinlyShowCase 
          tenga todo el espacio vertical que necesita para sus animaciones.
        */}
        <div className="w-full">
          <VinlyShowCase />
        </div>
      </section>
      
     
      {/* Capturar leads */}
      <section className="py-32 w-full bg-[#FCFAF5] border-t border-[#C4A882]/20">
        <div className="container mx-auto px-6 flex justify-center items-center">
          
          
          <div className="w-full flex justify-center items-center transform scale-105 md:scale-110">
            <VintageForm />
          </div>
          
        </div>
      </section>
    </div>
  );
}