'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/app/lib/useAuthStore';
import { useCartStore } from '@/app/lib/useCartStore';
import { useProductDetailStore } from '@/app/lib/useProductDetailStore';
import { Collection } from '@/app/perfil/components/Collection';
import {
    AlertTriangle,
    ArrowLeft,
    Cpu,
    Database,
    Loader2,
    ShieldCheck,
    ShoppingCart,
    Terminal
} from 'lucide-react';
import Link from 'next/link';
import { getProductByIdAction } from '../actions/productIdActions';
import Rockola from '../components/Rockola';
import VinylPlayer from '../components/VinylPlayer';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { selectedProduct, isLoadingDetail, setSelectedProduct, setIsLoadingDetail, clearProductDetail } = useProductDetailStore();
    const { user } = useAuthStore();
    const { addItem, items } = useCartStore();
    const [error, setError] = useState<string | null>(null);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const fetchProductDetail = async () => {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!id || !uuidRegex.test(id)) { router.push('/catalogo'); return; }
            try {
                setIsLoadingDetail(true);
                const data = await getProductByIdAction(id);
                setSelectedProduct(data);
            } catch { setError("ERROR_CRÍTICO: No se pudo desencriptar la información del archivo."); }
            finally { setIsLoadingDetail(false); }
        };
        fetchProductDetail();
        return () => clearProductDetail();
    }, [id, setSelectedProduct, setIsLoadingDetail, clearProductDetail, router]);

    const isInCart = selectedProduct ? items.some(i => i.id === selectedProduct.id) : false;

    const handleAddToCart = () => {
        if (!selectedProduct) return;
        addItem({ id: selectedProduct.id, name: selectedProduct.name, price: Number(selectedProduct.price), imageUrl: selectedProduct.imageUrl ?? '' });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    if (isLoadingDetail) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#020202]">
            <div className="relative">
                <Loader2 className="w-16 h-16 text-cyan-500 animate-spin mb-6 drop-shadow-[0_0_15px_rgba(0,245,255,0.8)]" />
                <div className="absolute inset-0 w-16 h-16 rounded-full border-t-2 border-fuchsia-500 animate-[spin_2s_linear_infinite_reverse]" />
            </div>
            <p className="text-cyan-400 font-mono text-xs uppercase tracking-[0.4em] animate-pulse">Extrayendo_Paquetes_De_Datos...</p>
        </div>
    );

    if (error || !selectedProduct) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#020202] p-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_15px,rgba(255,0,0,0.03)_15px,rgba(255,0,0,0.03)_30px)]" />
            <div className="border-2 border-red-500 p-12 rounded-lg text-center bg-red-950/30 max-w-lg relative z-10 shadow-[0_0_40px_rgba(255,0,0,0.2)]">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6 animate-pulse" />
                <h2 className="text-white text-2xl font-black uppercase mb-2 tracking-widest">Archivo Corrupto</h2>
                <p className="text-red-400 font-mono text-[10px] uppercase tracking-widest mb-8">{error || "SECTOR NO ENCONTRADO."}</p>
                <button onClick={() => router.push('/catalogo')} className="text-[10px] font-bold text-black uppercase tracking-widest bg-red-500 px-8 py-3 rounded-sm hover:bg-white transition-all">
                    ABORTAR Y VOLVER
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020202] text-white font-sans relative selection:bg-cyan-500/30">

            {/* Fondo global */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-b from-cyan-900/10 to-transparent blur-[100px] pointer-events-none z-0" />
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,245,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,255,0.02)_1px,transparent_1px)] bg-[length:30px_30px] z-0" />

            {/* ── Info del producto ── */}
            <div className="max-w-6xl mx-auto relative z-10 px-6 md:px-12 pt-6 md:pt-10 pb-10">

                <Link href="/catalogo" className="inline-flex items-center gap-3 text-cyan-500 hover:text-cyan-300 font-mono text-[10px] uppercase tracking-[0.2em] mb-10 transition-colors group bg-black/50 border border-cyan-900/50 px-4 py-2 rounded-sm backdrop-blur-sm">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Volver al Catálogo
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-start">

                    {/* COLUMNA IZQUIERDA */}
                    <div className="lg:col-span-5 relative w-full flex flex-col justify-center items-center min-h-[350px]">
                        {selectedProduct.category === 'VINILO' ? (
                            <VinylPlayer productName={selectedProduct.name} imageUrl={selectedProduct.imageUrl} youtubeUrl={selectedProduct.youtubeUrl} />
                        ) : (
                            <div className="relative w-full aspect-square bg-[#050508] rounded-xl border-2 border-gray-800 hover:border-cyan-500/50 overflow-hidden flex items-center justify-center p-8 shadow-[inset_0_0_50px_rgba(0,0,0,1)] transition-colors duration-500 group">
                                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,245,255,0.1)_2px,rgba(0,245,255,0.1)_4px)]" />
                                <div className="absolute w-2/3 h-2/3 bg-cyan-500/10 blur-[60px] rounded-full group-hover:bg-fuchsia-500/10 transition-colors duration-1000 z-0" />
                                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 right-4 bg-black/80 border border-cyan-500/40 px-3 py-1.5 rounded-sm text-cyan-400 font-mono text-[9px] flex items-center gap-2 backdrop-blur-md z-20 uppercase tracking-widest">
                                    <ShieldCheck className="w-3.5 h-3.5 text-fuchsia-500" /> Hash_Validado
                                </div>
                            </div>
                        )}
                    </div>

                    {/* COLUMNA DERECHA */}
                    <div className="lg:col-span-7 flex flex-col justify-center w-full">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="inline-block border border-fuchsia-500 text-fuchsia-400 bg-fuchsia-950/30 px-3 py-1 rounded-sm font-mono text-[10px] uppercase tracking-[0.2em] shadow-[0_0_10px_rgba(217,70,239,0.2)]">ESTADO: {selectedProduct.condition}</span>
                                <span className="inline-block border border-gray-700 text-gray-400 bg-black/50 px-3 py-1 rounded-sm font-mono text-[10px] uppercase tracking-[0.2em]">CAT: {selectedProduct.category}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none mb-2 break-words">
                                {selectedProduct.name}
                            </h1>
                        </div>

                        <div className="bg-[#050508] border-l-4 border-cyan-500 p-5 rounded-r-xl mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            <Terminal className="w-4 h-4 text-cyan-500 mb-2 opacity-50" />
                            <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed font-mono">{selectedProduct.description}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            <div className="bg-black/50 border border-gray-800 rounded-lg p-5 flex items-start gap-4 hover:border-cyan-900 transition-colors">
                                <div className="p-2 bg-cyan-950/30 rounded-md border border-cyan-900"><Cpu className="w-5 h-5 text-cyan-400" /></div>
                                <div>
                                    <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-1">Arquitectura</p>
                                    <p className="font-bold text-white text-sm">{selectedProduct.platform}</p>
                                </div>
                            </div>
                            <div className="bg-black/50 border border-gray-800 rounded-lg p-5 flex items-start gap-4 hover:border-fuchsia-900 transition-colors">
                                <div className="p-2 bg-fuchsia-950/30 rounded-md border border-fuchsia-900"><Database className="w-5 h-5 text-fuchsia-400" /></div>
                                <div>
                                    <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-1">Data_Log</p>
                                    <p className="font-medium text-gray-300 text-xs italic leading-tight">{selectedProduct.trivia}</p>
                                </div>
                            </div>
                        </div>

                        {/* Zona de compra */}
                        <div className="bg-[#050508]/80 border border-cyan-800/50 rounded-xl p-6 md:p-8 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500" />
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="w-full sm:w-auto text-center sm:text-left shrink-0">
                                    <div className="font-mono text-[10px] text-cyan-500 uppercase tracking-[0.2em] mb-2 flex items-center justify-center sm:justify-start gap-2">
                                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse block" />
                                        <span>Valor_de_Transferencia</span>
                                    </div>
                                    <p className="text-5xl font-black text-white tracking-tighter">
                                        <span className="text-gray-500 text-3xl mr-1">$</span>{selectedProduct.price}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                                    {user && <div className="w-full sm:w-auto"><Collection productId={selectedProduct.id} productName={selectedProduct.name} /></div>}
                                    {user ? (
                                        <button onClick={handleAddToCart} disabled={isInCart}
                                            className={`w-full sm:w-auto px-8 py-4 rounded-sm font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 ${
                                                isInCart ? 'bg-[#050505] border-2 border-green-500/50 text-green-400 cursor-default'
                                                : addedToCart ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,245,255,0.6)] scale-[1.02]'
                                                : 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:-translate-y-1'
                                            }`}>
                                            {isInCart ? <><ShoppingCart className="w-4 h-4" /> En Carrito</>
                                            : addedToCart ? <><ShieldCheck className="w-4 h-4" /> Inyectado</>
                                            : <><Terminal className="w-4 h-4" /> Agregar al Carrito</>}
                                        </button>
                                    ) : (
                                        <Link href="/login" className="w-full sm:w-auto bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-8 py-4 rounded-sm font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:-translate-y-1">
                                            <Terminal className="w-4 h-4" /> Loguearse
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row sm:justify-between items-center text-gray-600 font-mono text-[9px] uppercase tracking-widest gap-2 bg-black/40 py-2 px-4 rounded-sm border border-gray-900">
                            <p>ID_Sys: <span className="text-gray-400">{selectedProduct.id.split('-')[0]}</span></p>
                            <p className="hidden sm:block">|</p>
                            <p>Seller_Node: <span className="text-cyan-600">{selectedProduct.seller}</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ROCKOLA flush, sin espacio muerto ── */}
            {selectedProduct.category === 'VINILO' && (
                <div className="w-full relative z-10">
                    <Rockola
                        albumName={selectedProduct.name}
                        imageUrl={selectedProduct.imageUrl}
                        youtubeUrl={selectedProduct.youtubeUrl}
                    />
                </div>
            )}
        </div>
    );
}