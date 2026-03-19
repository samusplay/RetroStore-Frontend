
import VintageForm from "./components/VintageForm";

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-white">
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
      {/* componente de use state */}
      <section className="w-full">
        {/* inyectar BranCarrusel */}
        <div className="py-12 bg-zinc-50 border-y border-zinc-100 text-center text-zinc-400 text-sm font-bold tracking-widest border-dashed">
          Carrusel de Marcas
        </div>
      </section>
      {/* galeria con eventos */}
      <section className="py-24 container mx-auto px-6 border-b border-zinc-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
            La Joya de la Corona
          </h2>
          <p className="text-zinc-500 mt-2">
            Interactúa con nuestra pieza más exclusiva de la semana.
          </p>
        </div>
        {/* featuredGallery */}
        <div className="h-96 bg-zinc-50 rounded-3xl flex items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-200">
          Galeria interactiva
        </div>
      </section>
      {/* Catalogo lista */}
      <section className="py-24 container mx-auto px-6 bg-white">
        <div className="flex justify-between items-end mb-12 border-b border-zinc-100 pb-6">
          <div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
              Recién Llegados
            </h2>
            <p className="text-zinc-500 mt-2">
              Tesoros rescatados esta semana.
            </p>
          </div>
          <button className="hidden md:block text-orange-500 font-bold hover:text-zinc-900 transition-colors">
            Ver todo →
          </button>
        </div>
        <div className="h-64 bg-zinc-50 rounded-3xl flex items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-200">
          [ AQUÍ VA EL GRID DE PRODUCTOS DEL DEV 2 ]
        </div>
      </section>
      {/* Capturar leads */}
      <section className="py-24 bg-zinc-900 text-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Únete al Club Retro.
          </h2>
          <p className="text-zinc-400 text-lg mb-12 max-w-xl mx-auto">
            Las mejores reliquias se venden en minutos. Déjanos tu correo y te
            avisaremos antes de publicarlas en la tienda.
          </p>

          {/* INYECTAR AQUÍ: <Form /> */}
          <div className="h-48 bg-zinc-800 rounded-3xl flex items-center justify-center text-zinc-500 border-2 border-dashed border-zinc-700">
            <VintageForm />
          </div>
        </div>
      </section>
    </div>
  );
}



