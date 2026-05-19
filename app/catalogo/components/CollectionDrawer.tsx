'use client';

import { useAuthStore } from '@/app/lib/useAuthStore';
import { getCollectionAction, removeFromCollectionAction } from '@/app/perfil/actions/collection.action';
import { ArrowRight, BookmarkX, Loader2, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface CollectionItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
}

interface CollectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CollectionDrawer({ isOpen, onClose }: CollectionDrawerProps) {
  const { token } = useAuthStore();
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Cargar colección cuando se abre
  useEffect(() => {
  if (!isOpen) return;
  const loadCollection = async () => {
    try {
      setLoading(true);
      const data = await getCollectionAction();
      setCollection(data);
    } catch {
      toast.error('Error al cargar tu colección');
    } finally {
      setLoading(false);
    }
  };
  loadCollection();
}, [isOpen]); 

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleRemove = async (productId: string, productName: string) => {
    setRemovingId(productId);
    try {
      await removeFromCollectionAction(productId);
      setCollection((prev) => prev.filter((p) => p.id !== productId));
      toast.success(`${productName} eliminado`);
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col
          bg-[#080810] border-l border-fuchsia-500/30
          shadow-[-20px_0_60px_rgba(217,70,239,0.15)]
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Línea neon superior */}
        <div className="h-0.5 w-full bg-linear-to-r from-cyan-400 via-fuchsia-500 to-cyan-400" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <h2 className="text-lg font-black uppercase tracking-widest text-transparent bg-clip-text bg-linear-to-r from-fuchsia-400 to-cyan-400">
              Mi Colección
            </h2>
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/30 mt-0.5">
              {collection.length} {collection.length === 1 ? 'reliquia' : 'reliquias'} guardadas
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-fuchsia-500/50 hover:shadow-[0_0_12px_rgba(217,70,239,0.3)] transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="w-8 h-8 text-fuchsia-400 animate-spin" />
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 animate-pulse">
                Sincronizando_Archivos...
              </p>
            </div>
          ) : collection.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <BookmarkX className="w-12 h-12 text-white/10" />
              <p className="text-white/20 font-mono text-xs uppercase tracking-widest">
                Tu colección está vacía
              </p>
              <p className="text-white/10 font-mono text-[9px]">
                Agrega productos desde el catálogo
              </p>
              <button
                onClick={onClose}
                className="mt-2 text-[10px] font-mono uppercase tracking-widest text-cyan-400/60 hover:text-cyan-400 underline underline-offset-4 transition-colors"
              >
                Ir al catálogo →
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-white/5 px-2 py-2">
              {collection.map((item) => (
                <li
                  key={item.id}
                  className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/3 transition-all duration-200"
                >
                  {/* Imagen */}
                  <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-black/40">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain p-1.5"
                    />
                    {/* Glow en hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_12px_rgba(34,211,238,0.2)]" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-fuchsia-400 font-mono text-xs font-bold">
                        ${item.price}
                      </span>
                      <span className="text-[8px] font-mono uppercase text-white/20 border border-white/10 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link
                      href={`/catalogo/${item.id}`}
                      onClick={onClose}
                      className="p-1.5 rounded-lg text-cyan-500/60 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                      title="Ver producto"
                    >
                      <ArrowRight size={14} />
                    </Link>
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      disabled={removingId === item.id}
                      className="p-1.5 rounded-lg text-red-500/60 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30"
                      title="Eliminar de colección"
                    >
                      {removingId === item.id
                        ? <Loader2 size={14} className="animate-spin" />
                        : <Trash2 size={14} />
                      }
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {collection.length > 0 && (
          <div className="px-6 py-4 border-t border-white/5">
            <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-white/20">
              <span>Total reliquias: {collection.length}</span>
              <span className="text-fuchsia-400/40">RetroStore ©2026</span>
            </div>
          </div>
        )}

        {/* Línea neon inferior */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-fuchsia-500/30 to-transparent" />
      </div>
    </>
  );
}