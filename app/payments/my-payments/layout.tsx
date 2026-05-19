import { ReactNode } from 'react';

export default function TimeMachineLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020202] relative selection:bg-[#00FFFF]/30">
      
      {/* 📺 EFECTO CRT GLOBAL (Scanlines) - Flota por encima de todo sin bloquear clics */}
      <div className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>

      {/* ⚠️ MARCO SUPERIOR: Hazard Stripes (Industrial) */}
      <div className="fixed top-0 left-0 w-full h-3 z-40 bg-[repeating-linear-gradient(45deg,#000,#000_15px,#FFCC00_15px,#FFCC00_30px)] border-b-2 border-[#FFCC00] shadow-[0_5px_15px_rgba(255,204,0,0.3)]"></div>

      {/* 🔌 CABLES/TUBOS ESTÉTICOS LADOS (Opcional, visible en Desktop) */}
      <div className="hidden xl:block fixed left-4 top-0 bottom-0 w-2 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 border-x border-black z-30 shadow-[5px_0_15px_rgba(0,0,0,0.8)]"></div>
      <div className="hidden xl:block fixed right-4 top-0 bottom-0 w-2 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 border-x border-black z-30 shadow-[-5px_0_15px_rgba(0,0,0,0.8)]"></div>

      {/* 🌌 CONTENIDO PRINCIPAL (Tu MyPaymentsPage se inyecta aquí) */}
      <main className="relative z-10 pt-4 pb-4">
        {children}
      </main>

      {/* ⚠️ MARCO INFERIOR: Hazard Stripes (Industrial) */}
    
      
    </div>
  );
}