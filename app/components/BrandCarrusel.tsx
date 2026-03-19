'use client'

import { useEffect, useState } from "react";

//arreglo imagenes
//luego migralo a Nest.js
const marcasRetro = [
    {
        id: 1,
        nombre: "Sega",
        url: "https://res.cloudinary.com/dovbivm6m/image/upload/v1773715789/Sega-logo_nfzate.png"
    },
    {
        id: 2,
        nombre: "Kappa",
        url: "https://res.cloudinary.com/dovbivm6m/image/upload/v1773715595/logo-Kappa_evyktj.png"
    },
    {
        id: 3,
        nombre: "PlayStation",
        url: "https://res.cloudinary.com/dovbivm6m/image/upload/v1773719100/Playstation_logo_colour.svg_r6pxip.png"
    },
    {
        id: 4,
        nombre: "Sony",
        url: "https://res.cloudinary.com/dovbivm6m/image/upload/v1773719784/andes-photo-brand_sony.png_uedgdx.png"
    }
];
export default function BrandCarrusel() {
    //funcion useState
    const [indiceActual, setIndiceActual] = useState(0)

    //useEffect
    useEffect(() => {
        const intervalo = setInterval(() => {
            //actualizamos el estado
            setIndiceActual((indiceAnterior) => {
                if (indiceAnterior === 3) {
                    return 0; //volvemos al primero
                } else {
                    return indiceAnterior + 1 //si pasamos al siguiente
                }
            });
        }, 3000)
        return () => clearInterval(intervalo)
    }, [])
    const marcaVisible = marcasRetro[indiceActual]

    return (
       <div className="flex justify-center items-center h-40 overflow-hidden w-full px-6">
      <img
        key={marcaVisible.id} 
        src={marcaVisible.url}
        alt={`Logo de ${marcaVisible.nombre}`}
        
        className="h-32 md:h-40 w-auto object-contain transition-all duration-500 hover:scale-110 opacity-70 hover:opacity-100 drop-shadow-sm"
      />
    </div>

    )



}