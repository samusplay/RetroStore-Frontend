//app/catalogo/layout.tsx

import React from "react";

//funcion del layout pasamos children va recibir los props
export default function CatalogoLayout({children}:{children:React.ReactNode}){
    return(
        <section className="flex bg-[#F5F5DC] min-h-screen">
            <aside className="w-64 p-4 border-r-2 border-orange-300">
                <h2 className="font-bold text-orange-700">Store Retro</h2>
                {/* botones categoria*/ }
            </aside>
            <div className="flex-1 p-8">
                {children}
            </div>
        </section>
    )

}