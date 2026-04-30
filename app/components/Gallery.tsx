'use client'
import { useState } from "react";

const productsTop = [
    {
        id: 1,
        nombre: "Super Nintendo SNES (1990)",
        precio: 249.99,
        descripcion: "Consola original restaurada, incluye control clásico gris con botones morados. Perfecta para Mario y Zelda retro.",
        url: "https://res.cloudinary.com/dovbivm6m/image/upload/v1773776816/1600_gn407n.jpg"
    },
    {
        id: 2,
        nombre: "AC Milan Kappa Mediolanum 88-90",
        precio: 179.99,
        descripcion: "Camiseta vintage Kappa de la era Sacchi. Estado excelente, cuello V grande y telas premium de finales de los 80.",
        url: "https://res.cloudinary.com/dovbivm6m/image/upload/v1773776573/1-ShirtFront-ACMilan1988-1989HomeLong-SleeveJersey_syirac.jpg"
    },
    {
        id: 3,
        nombre: "Kappa Tracksuit Jacket 90s",
        precio: 129.99,
        descripcion: "Chaqueta windbreaker vintage Kappa con Omini en hombros. Estilo casual retro con el branding clásico de la época.",
        url: "https://res.cloudinary.com/dovbivm6m/image/upload/v1773776339/s-l1200_iy5fsv.webp"
    },
    {
        id: 4,
        nombre: "Vinilo Journey - Escape (1981)",
        precio: 120.00,
        descripcion: "Edición original con 'Don't Stop Believin''. Portada icónica de nave espacial, vinilo en estado Near Mint.",
        url: "https://res.cloudinary.com/dovbivm6m/image/upload/v1773799761/il_fullxfull.7703518004_jdvw_1_jdkkfw.webp"
    }
];

export default function Gallery() {
    const [productoActual, setProductoActual] = useState(0)
    const productoVisible = productsTop[productoActual]

    const handleBuy = () => {
        alert(`¡Has añadido "${productoVisible.nombre}" a tu colección privada!`)
    }

    return (
        <div className="flex flex-col md:flex-row gap-12 items-center bg-[#0a0a0f]/60 backdrop-blur-xl p-8 md:p-12 rounded-4xl border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
            
            {/* --- COLUMNA IZQUIERDA: VISOR HOLOGRÁFICO --- */}
            <div className="w-full md:w-1/2 flex flex-col gap-6">
                
                {/* Imagen Principal con Marco de Neón */}
                <div className="relative w-full h-87.5 md:h-112.5 rounded-3xl overflow-hidden bg-black/40 border-2 border-cyan-500/30 group">
                    {/* Efecto de Scanlines sobre la imagen */}
                    <div className="absolute inset-0 pointer-events-none z-10 opacity-10"
                         style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(255,255,255,0.1) 50%)', backgroundSize: '100% 4px' }}>
                    </div>
                    
                    <img
                        src={productoVisible.url}
                        alt={productoVisible.nombre}
                        className="w-full h-full object-contain p-8 transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                    />
                    
                    {/* Luces decorativas en las esquinas */}
                    <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
                    <div className="absolute bottom-4 right-4 text-[10px] font-mono text-cyan-500/50">RES_HIGH_DEF // 1080p</div>
                </div>
                
                {/* Miniaturas tipo "Selector de Inventario" */}
                <div className="grid grid-cols-4 gap-4">
                    {productsTop.map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => setProductoActual(index)}
                            className={`relative h-20 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                productoActual === index
                                ? 'border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.5)] scale-105 bg-fuchsia-500/10'
                                : 'border-gray-800 bg-black/20 opacity-50 hover:opacity-100 hover:border-cyan-500/50'
                            }`}
                        >
                            <img
                                src={item.url}
                                alt={item.nombre}
                                className="w-full h-full object-cover p-2"
                            />
                            {productoActual === index && (
                                <div className="absolute inset-0 border-t-2 border-fuchsia-400 animate-pulse"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- COLUMNA DERECHA: INTERFAZ DE DATOS --- */}
            <div className="w-full md:w-1/2 flex flex-col items-start text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.3em] text-fuchsia-400 uppercase bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-lg">
                    <span className="w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse"></span>
                    Item de Colección
                </div>

                <h3 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-none">
                    {productoVisible.nombre.split(' ').map((word, i) => (
                        <span key={i} className={i % 2 === 0 ? "text-white" : "text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-cyan-600"}>
                            {word}{' '}
                        </span>
                    ))}
                </h3>

                <div className="space-y-4 mb-8">
                    <p className="text-cyan-100/60 text-lg leading-relaxed font-medium border-l-4 border-cyan-500/20 pl-6 italic">
                        "{productoVisible.descripcion}"
                    </p>
                    <div className="flex gap-4">
                        <span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded text-gray-400">STATUS: VERIFIED</span>
                        <span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded text-gray-400">ORIGIN: VINTAGE_VAULT</span>
                    </div>
                </div>

                <div className="flex items-baseline gap-4 mb-10">
                    <span className="text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        ${productoVisible.precio}
                    </span>
                    <span className="text-cyan-500 font-mono text-sm uppercase tracking-widest">credits_required</span>
                </div>

                <button
                    onClick={handleBuy}
                    className="group relative w-full overflow-hidden bg-white text-black px-10 py-5 rounded-2xl font-black text-xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-cyan-400 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10 group-hover:text-white flex items-center justify-center gap-3">
                        ADQUIRIR RELIQUIA
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </span>
                </button>
                
                <p className="mt-6 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                    Seguridad encriptada // Transacción 256-bit
                </p>
            </div>

        </div>
    )
}