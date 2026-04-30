'use client';

import { BookmarkPlus } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuthStore } from '@/app/lib/useAuthStore';
import { addToCollectionAction } from '../actions/collection.action';

interface CollectionProps {
  productId: string;
  productName: string;
}

export function Collection({ productId, productName }: CollectionProps) {
  const { user } = useAuthStore();

  const handleCollection = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('🚀 handleCollection disparado');
    console.log('👤 Usuario:', user ? user.username : 'NO HAY USUARIO');
    console.log('🎯 productId:', productId);

    if (!user) {
      toast.error("Inicia sesión para expandir tu colección");
      return;
    }

    const toastId = toast.loading(`Sincronizando ${productName}...`);

    try {
      console.log('📡 Llamando addToCollectionAction...');
      const result = await addToCollectionAction(productId);
      console.log('✅ Respuesta del backend:', result);
      toast.success(`${productName} añadido a tu colección`, { id: toastId });
    } catch (err: any) {
      console.error('❌ Error:', err.message);
      toast.error(err.message || "Error al guardar", { id: toastId });
    }
  };

  return (
    <button
      onClick={handleCollection}
      className="group/btn bg-zinc-900 border border-fuchsia-500/50 text-fuchsia-500 p-2 rounded-lg 
                 hover:bg-fuchsia-500 hover:text-white transition-all duration-300 
                 shadow-[0_0_10px_rgba(217,70,239,0.2)] hover:shadow-[0_0_20px_rgba(217,70,239,0.5)]"
      title="Añadir a mi colección"
    >
      <BookmarkPlus 
        size={20} 
        strokeWidth={2.5} 
        className="group-hover/btn:scale-110 transition-transform" 
      />
    </button>
  );
}