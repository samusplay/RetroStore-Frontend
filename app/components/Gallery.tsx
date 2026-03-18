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
        nombre: "AC Milan Kappa Mediolanum 1988-1990 (Larga manga)",
        precio: 179.99,
        descripcion: "Camiseta vintage Kappa de la era Sacchi, sponsor Mediolanum. Estado excelente, cuello V grande y telas premium.",
        url: "https://res.cloudinary.com/dovbivm6m/image/upload/v1773776573/1-ShirtFront-ACMilan1988-1989HomeLong-SleeveJersey_syirac.jpg"
    },
    {
        id: 3,
        nombre: "Kappa Tracksuit Jacket 90s (Rojo/Blanco/Azul)",
        precio: 129.99,
        descripcion: "Chaqueta windbreaker vintage Kappa con Omini en hombros y bandas laterales. Estilo casual retro, cremallera frontal.",
        url: "https://res.cloudinary.com/dovbivm6m/image/upload/v1773776339/s-l1200_iy5fsv.webp"
    },
    {
        id: 4,
        nombre: "Vinilo Journey - Escape (1981)",
        precio: 120.00,
        descripcion: "Edición original con 'Don't Stop Believin''. Portada icónica de nave espacial, vinilo en estado NM (Near Mint).",
        url: "https://res.cloudinary.com/dovbivm6m/image/upload/v1773799761/il_fullxfull.7703518004_jdvw_1_jdkkfw.webp"
    }
];

export default function Gallery() {
    //creamos el hook
    const [productoActual, setProductoActual] = useState(0)

    //producto visible
    const productoVisible = productsTop[productoActual]

    //funcion simulando compras
    const handleBuy = () => {
        alert(`¡Has añadido "${productoVisible.nombre}" a tu carrito!`)
    }
    return (
        <div className="flex flex-col md:flex-row gap-12 items-center bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
            
            {/* --- COLUMNA IZQUIERDA: IMÁGENES --- */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
                
                {/* Imagen Principal Grande */}
                <div className="w-full h-80 md:h-100 rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200 p-4">
                    <img
                        src={productoVisible.url}
                        alt={productoVisible.nombre}
                        className="w-full h-full object-contain transition-all duration-300"
                    />
                </div>
                
                {/* cuadricula de miniaturas */}
                <div className="grid grid-cols-4 gap-4">
                    {productsTop.map((item, index) => (
                        <div
                            key={item.id}
                            onClick={() => setProductoActual(index)}
                            onMouseEnter={() => setProductoActual(index)}
                            className={`h-20 md:h-24 rounded-xl overflow-hidden cursor-pointer border-2 bg-zinc-50 transition-all duration-200 ${productoActual === index
                                ? 'border-orange-500 opacity-100 scale-105 shadow-md'
                                : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                        >
                            <img
                                src={item.url}
                                alt={item.nombre}
                                className="w-full h-full object-cover p-2"
                            />
                        </div>
                    ))}
                </div>
            </div> {/* <-- ¡ESTE ES EL DIV QUE FALTABA! Cierra la columna izquierda */}

            {/* --- COLUMNA DERECHA: TEXTOS Y BOTÓN --- */}
            <div className="w-full md:w-1/2 flex flex-col items-start text-left">
                <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-orange-600 uppercase bg-orange-100 rounded-full">
                    Destacado Semanal
                </div>

                <h3 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4 tracking-tight">
                    {productoVisible.nombre}
                </h3>

                <p className="text-zinc-500 text-lg mb-6 leading-relaxed">
                    {productoVisible.descripcion}
                </p>

                <div className="text-3xl font-black text-zinc-900 mb-8">
                    ${productoVisible.precio}
                </div>

                <button
                    onClick={handleBuy}
                    className="w-full md:w-auto bg-zinc-900 hover:bg-orange-500 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-orange-500/30 transform hover:-translate-y-1"
                >
                    Añadir a mi colección
                </button>
            </div>

        </div>
    )

}