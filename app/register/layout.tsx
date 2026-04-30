// app/(auth)/layout.tsx

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a001e]">

      {/* ── IMAGEN DE FONDO ── */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-bottom bg-no-repeat"
        style={{ backgroundImage: "url('/images/retrowave-bg.jpg')" }}
      />

      {/* ── GRADIENTE OSCURECEDOR (arriba + abajo, centro limpio) ── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0a001e]/60 via-transparent to-[#0a001e]/70" />

      {/* ── SCANLINES CRT (textura sutil) ── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #00ffff, #00ffff 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* ── GLOW NEON EN EL HORIZONTE ── */}
      <div className="absolute bottom-0 left-0 right-0 h-48 z-[2] pointer-events-none bg-gradient-to-t from-cyan-400/20 via-cyan-400/5 to-transparent blur-lg" />

      {/* ── CONTENIDO ── */}
      <main className="relative z-10 w-full flex items-center justify-center px-4 py-8">
        {children}
      </main>

    </div>
  );
}