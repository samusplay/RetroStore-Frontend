'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/app/lib/useAuthStore';
import { useProductDetailStore } from '@/app/lib/useProductDetailStore';
import { Collection } from '@/app/perfil/components/Collection';
import {
    AlertTriangle,
    ArrowLeft,
    Gamepad,
    Info,
    Loader2,
    ShieldCheck,
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

    const {
        selectedProduct,
        isLoadingDetail,
        setSelectedProduct,
        setIsLoadingDetail,
        clearProductDetail
    } = useProductDetailStore();

    const { user } = useAuthStore();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductDetail = async () => {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (!id || !uuidRegex.test(id)) {
                router.push('/catalogo');
                return;
            }

            try {
                setIsLoadingDetail(true);
                const data = await getProductByIdAction(id);
                setSelectedProduct(data);
            } catch (err) {
                setError("Error: No se pudo desencriptar la información del archivo.");
            } finally {
                setIsLoadingDetail(false);
            }
        };

        fetchProductDetail();
        return () => clearProductDetail();
    }, [id, setSelectedProduct, setIsLoadingDetail, clearProductDetail, router]);

    if (isLoadingDetail) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050508]">
                <Loader2 className="w-16 h-16 text-fuchsia-500 animate-spin mb-6 drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]" />
                <p className="text-cyan-400 font-mono text-sm uppercase tracking-[0.4em] animate-pulse">
                    Descargando_Reliquia...
                </p>
            </div>
        );
    }

    if (error || !selectedProduct) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050508] p-6">
                <div className="border-2 border-dashed border-red-500/50 p-12 rounded-4xl text-center bg-red-900/10 max-w-lg">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h2 className="text-white text-2xl font-black uppercase mb-2">Archivo Corrupto</h2>
                    <p className="text-red-400 font-mono text-xs uppercase mb-8">{error || "Producto no encontrado."}</p>
                    <button
                        onClick={() => router.push('/catalogo')}
                        className="text-sm font-bold text-black bg-cyan-500 px-8 py-3 rounded-full hover:bg-white transition-all"
                    >
                        VOLVER A LA BASE
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050508] text-white font-sans relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-cyan-900/20 blur-[150px] pointer-events-none z-0"></div>

            {/* ── Contenido principal acotado ── */}
            <div className="max-w-6xl mx-auto relative z-10 px-6 md:px-12 pt-6 md:pt-12">

                <Link
                    href="/catalogo"
                    className="inline-flex items-center gap-3 text-cyan-500 hover:text-fuchsia-400 font-mono text-xs uppercase tracking-widest mb-10 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                    Regresar_al_Directorio
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

                    {/* COLUMNA IZQUIERDA */}
                    <div className="relative group w-full flex flex-col justify-center">
                        {selectedProduct.category === 'VINILO' ? (
                            <VinylPlayer
                                productName={selectedProduct.name}
                                imageUrl={selectedProduct.imageUrl}
                                youtubeUrl={selectedProduct.youtubeUrl}
                            />
                        ) : (
                            <>
                                <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-fuchsia-500 rounded-3xl blur-lg opacity-15 group-hover:opacity-30 transition duration-1000"></div>
                                <div className="relative w-full h-62.5 md:h-87.5 bg-[#050508]/80 rounded-3xl border border-cyan-500/20 overflow-hidden flex items-center justify-center p-6 md:p-8 backdrop-blur-md shadow-[inset_0_0_40px_rgba(0,0,0,0.7)]">
                                    <div className="absolute inset-0 pointer-events-none opacity-[0.1]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(255,255,255,0.1) 50%)', backgroundSize: '100% 4px' }}></div>
                                    <div className="absolute w-1/2 h-1/2 bg-cyan-500/10 blur-[60px] rounded-full group-hover:bg-fuchsia-500/10 transition-colors duration-1000 z-0"></div>
                                    <img
                                        src={selectedProduct.imageUrl}
                                        alt={selectedProduct.name}
                                        className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)] group-hover:scale-[1.2] group-hover:-translate-y-1 transition-all duration-700 ease-out"
                                    />
                                    <div className="absolute top-3 right-3 bg-black/90 border border-cyan-500/40 px-2.5 py-1.5 rounded-md text-cyan-400 font-mono text-[9px] flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.2)] backdrop-blur-md z-20">
                                        <ShieldCheck className="w-3 h-3 text-fuchsia-500" /> Validated
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* COLUMNA DERECHA */}
                    <div className="flex flex-col justify-center">

                        <div className="mb-6">
                            <span className="inline-block border border-fuchsia-500/50 text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest mb-4">
                                Condición: {selectedProduct.condition}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-white to-fuchsia-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                                {selectedProduct.name}
                            </h1>
                        </div>

                        <p className="text-gray-400 text-lg md:text-xl font-light mb-8 leading-relaxed border-l-2 border-cyan-500/30 pl-4">
                            "{selectedProduct.description}"
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
                                <Gamepad className="w-5 h-5 text-cyan-400 mt-0.5" />
                                <div>
                                    <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">Plataforma</p>
                                    <p className="font-bold text-white text-sm mt-1">{selectedProduct.platform}</p>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
                                <Info className="w-5 h-5 text-fuchsia-400 mt-0.5" />
                                <div>
                                    <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">Trivia</p>
                                    <p className="font-medium text-gray-300 text-xs mt-1 italic leading-tight">{selectedProduct.trivia}</p>
                                </div>
                            </div>
                        </div>

                        {/* ZONA DE COMPRA */}
                        <div className="flex flex-col md:flex-row items-center gap-6 mt-auto p-6 bg-cyan-950/20 rounded-2xl border border-cyan-500/30">
                            <div className="flex-1 w-full text-center md:text-left">
                                <p className="font-mono text-[10px] text-cyan-500 uppercase tracking-widest mb-1">Valor de Transacción</p>
                                <p className="text-5xl font-black text-white">
                                    ${selectedProduct.price}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                {user && (
                                    <Collection
                                        productId={selectedProduct.id}
                                        productName={selectedProduct.name}
                                    />
                                )}
                                <button className="flex-1 md:flex-none bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(217,70,239,0.5)] hover:scale-105 active:scale-95">
                                    <Terminal className="w-5 h-5" />
                                    Adquirir
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-between items-center text-gray-600 font-mono text-[9px] uppercase tracking-widest">
                            <p>ID_Sys: {selectedProduct.id.split('-')[0]}</p>
                            <p>Seller_Node: <span className="text-cyan-600">{selectedProduct.seller}</span></p>
                        </div>

                    </div>
                </div>
            </div>

            {/* 🚀 ROCKOLA — full width, fuera del max-w-6xl 🚀 */}
            {selectedProduct.category === 'VINILO' && (
                <div className="w-full px-6 md:px-12 pb-12 mt-8 relative z-10">
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