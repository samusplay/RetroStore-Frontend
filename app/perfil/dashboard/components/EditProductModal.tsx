// app/perfil/dashboard/components/EditProductModal.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { updateProductAction } from '../../actions/update-product.action';
import { UpdateProductFormValues, UpdateProductInput, updateProductSchema } from '../../schemas/update-product.schema';

interface EditProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function EditProductModal({ product, isOpen, onClose, onRefresh }: EditProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // 🛠️ FIX: Agregamos el < que faltaba y quitamos la propiedad youtubeUrl que no existe en el esquema
  const { register, handleSubmit, formState: { errors } } = useForm<
    UpdateProductFormValues,
    any,
    UpdateProductInput
  >({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      price: product.price,
      description: product.description,
      condition: product.condition,
      // 🚫 YouTubeUrl ELIMINADO de aquí porque ya no está en el esquema
    }
  });

  if (!isOpen || !mounted) return null;

  const onSubmit = async (data: UpdateProductInput) => {
    setLoading(true);
    try {
      // Enviamos la data limpia (precio, descripción, condición)
      await updateProductAction(product.id, data);
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error en el sistema:", error);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="w-full max-w-[420px] bg-[#050508] border-2 border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.4)] p-8 rounded-lg font-mono relative overflow-hidden">
        
        {/* Estética Arcade */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,3px_100%]"></div>
        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-fuchsia-600"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-fuchsia-600"></div>

        <h2 className="text-xl font-black text-cyan-400 mb-8 uppercase italic tracking-tighter">
          <span className="animate-pulse">▶</span> ACTUALIZAR_MODULO
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          
          <div className="space-y-2">
            <label className="block text-[10px] text-fuchsia-500 uppercase tracking-[0.3em] font-bold">
              [ VALOR_EN_CREDITOS ]
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500">$</span>
              <input 
                {...register('price', { valueAsNumber: true })}
                className="w-full bg-black border-b-2 border-cyan-900 p-3 pl-8 text-white focus:border-cyan-400 outline-none transition-all"
              />
            </div>
            {errors.price && <p className="text-red-500 text-[10px] mt-1">{errors.price.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] text-fuchsia-500 uppercase tracking-[0.3em] font-bold">
              [ METADATA_DESCRIPCION ]
            </label>
            <textarea 
              {...register('description')}
              rows={4}
              className="w-full bg-black border-2 border-cyan-900 p-4 text-white focus:border-cyan-400 outline-none resize-none"
            />
            {errors.description && <p className="text-red-500 text-[10px] mt-1">{errors.description.message}</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 border-2 border-gray-800 text-gray-400 py-3 hover:text-red-400 hover:border-red-500/50 transition-all uppercase text-[10px] font-bold">
              Abordar
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-cyan-500 text-black font-black py-3 hover:bg-cyan-300 transition-all uppercase text-[10px] disabled:opacity-50">
              {loading ? 'CARGANDO...' : 'CONFIRMAR'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}