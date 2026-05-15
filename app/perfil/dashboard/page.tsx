'use client';

import { useEffect, useState } from 'react';
import { getMyProductsAction } from '../actions/update-product.action';
import ProductGrid from './components/ProductGrid';

export default function DashboardPage() {
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const products = await getMyProductsAction();
      setMyProducts(products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-cyan-400 font-mono animate-pulse tracking-widest text-sm">
          CARGANDO INVENTARIO...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-8">
      <header className="mb-8 border-b border-cyan-500/30 pb-6 flex items-end justify-between">
        <div>
          <p className="text-cyan-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-1">
            SECTOR_VENDEDOR // ACCESO_AUTORIZADO
          </p>
          <h1 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 uppercase drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            Panel Arcade
          </h1>
          <p className="text-fuchsia-400 mt-1 font-mono text-sm tracking-widest uppercase">
            [ SISTEMA DE GESTIÓN DE INVENTARIO SELLER ]
          </p>
        </div>
        <div className="font-mono text-[10px] text-gray-600 text-right">
          <p>{myProducts.length} MÓDULOS REGISTRADOS</p>
          <p className="text-green-500">{myProducts.filter(p => p.isActive).length} ONLINE</p>
          <p className="text-red-500/70">{myProducts.filter(p => !p.isActive).length} OFFLINE</p>
        </div>
      </header>

      {myProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 border border-dashed border-cyan-500/30 rounded-xl bg-cyan-900/10">
          <span className="text-6xl mb-6 opacity-80 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse">👾</span>
          <h2 className="text-3xl font-black text-cyan-500 uppercase tracking-[0.3em]">Insert Coin</h2>
          <p className="text-gray-400 mt-4 font-mono text-sm">Aún no tienes módulos de inventario activos.</p>
        </div>
      ) : (
        <ProductGrid products={myProducts} onRefresh={fetchProducts} />
      )}
    </div>
  );
}