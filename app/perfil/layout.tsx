import React from "react";

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Usamos el mismo fondo Synthwave para mantener la estética, 
    // pero con un filtro de desenfoque más fuerte para que el formulario resalte.
    <div 
      className="min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-start py-12 relative bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/images/neon-sunset-bg.jpg')" }} 
    >
      {/* Overlay oscuro para mejorar el contraste de los inputs */}
      <div className="absolute inset-0 bg-black/60 z-0 backdrop-blur-sm"></div>

      <div className="w-full max-w-5xl relative z-10 px-4">
        {/* Un pequeño título de sección para el Dashboard */}
        <div className="mb-8 flex items-center gap-4">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-50"></div>
          <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-fuchsia-400">
            Sector_Vendedor // Acceso_Autorizado
          </span>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-50"></div>
        </div>
        
        {children}
      </div>
    </div>
  );
}