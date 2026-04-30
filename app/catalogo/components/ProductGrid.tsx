'use client';

import { useAuthStore } from '@/app/lib/useAuthStore';
import { useRetroStore } from '@/app/lib/useRetroStore';
import { Collection } from '@/app/perfil/components/Collection';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProductsAction } from '../actions/productActions';
import { Product } from '../schemas/product.schema';


export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryFilter = useRetroStore((state) => state.categoryFilter);
  const { user } = useAuthStore(); // 👈 sabemos si hay usuario logueado

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProductsAction(categoryFilter);
        setProducts(data);
      } catch (err) {
        setError("No se encontraron productos en esta categoría o hay un error de conexión.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [categoryFilter]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
        <p className="text-cyan-500 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">
          Filtrando_Base_de_Datos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-2 border-dashed border-red-500/30 p-10 rounded-3xl text-center bg-red-500/5">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-400 font-mono text-sm uppercase">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-xs font-bold text-white bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition-all"
        >
          REINTENTAR
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/5">
        <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">
          &gt; No hay existencias para: <span className="text-fuchsia-500">{categoryFilter}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative bg-[#0a0a0f] border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col"  // 👈 flex flex-col
        >
          {/* Badge ID */}
          <div className="absolute top-3 left-3 z-20">
            <span className="text-[8px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">
              ID: {product.id.slice(0, 8)}
            </span>
          </div>

          {/* Imagen — altura fija */}
          <div className="relative h-56 w-full bg-black/40 overflow-hidden shrink-0">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0f] to-transparent" />
          </div>

          {/* Info — flex-1 para que empuje el precio al fondo */}
          <div className="p-5 relative flex flex-col flex-1">
            <h3 className="text-white font-black text-lg uppercase tracking-tighter mb-1 group-hover:text-cyan-400 transition-colors line-clamp-2 min-h-[3.5rem]">  {/* 👈 line-clamp-2 + min-h */}
              {product.name}
            </h3>
            <p className="text-fuchsia-500 font-mono text-[10px] uppercase tracking-widest mb-4 truncate">  {/* 👈 truncate */}
              Seller: {product.seller}
            </p>

            {/* mt-auto empuja esto al fondo siempre */}
            <div className="flex justify-between items-center mt-auto">
              <span className="text-2xl font-black text-white">
                ${product.price}
              </span>

              <div className="flex items-center gap-2">
                {user && (
                  <Collection
                    productId={product.id}
                    productName={product.name}
                  />
                )}
                <Link
                  href={`/catalogo/${product.id}`}
                  className="bg-cyan-500 text-black p-2 rounded-lg hover:bg-fuchsia-500 hover:text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-0 h-1 bg-cyan-500 group-hover:w-full transition-all duration-500" />
        </div>
      ))}
    </div>
  );
}