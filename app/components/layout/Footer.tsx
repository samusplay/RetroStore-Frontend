// app/components/layout/Footer.tsx
export default function Footer() {
  // Lista de datos para cumplir con el Criterio 8 (Keys)
  const techStack = [
    { id: 1, name: 'Next.js', icon: 'https://res.cloudinary.com/dovbivm6m/image/upload/v1773719784/andes-photo-brand_sony.png_uedgdx.png' }, // Usando tus Cloudinary
    { id: 2, name: 'Nest.js', icon: 'https://res.cloudinary.com/dovbivm6m/image/upload/v1773715789/Sega-logo_nfzate.png' }
  ];

  return (
    <footer className="w-full bg-[#050508] border-t border-cyan-500/20 py-10 relative overflow-hidden">
      {/* Efecto de Scanline decorativo */}
      <div className="absolute top-0 left-0 w-full h-px bg-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>

      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Info del Desarrollador */}
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em] mb-1">
            Developed by
          </span>
          <h2 className="text-white font-black text-2xl tracking-tighter uppercase italic">
            Team Retro <span className="text-fuchsia-500 font-light text-xs not-italic">©2026</span>
          </h2>
        </div>

        {/* Logos Técnicos (Criterio 8 y 9) */}
        <div className="flex items-center gap-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
          {techStack.map((tech) => (
            <img 
              key={tech.id} 
              src={tech.icon} 
              alt={tech.name} 
              className="h-4 w-auto object-contain"
            />
          ))}
        </div>

        {/* Ubicación y Status */}
        <div className="text-right font-mono text-[9px] text-gray-500 uppercase tracking-widest">
          <p>Location: Bogotá_COL // Terminal_01</p>
          <p className="text-cyan-800">Connection: Secure_SSL</p>
        </div>
      </div>

      {/* Resplandor Neón de fondo */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none"></div>
    </footer>
  );
}