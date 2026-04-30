export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      // 1. Usamos calc para restar el alto aproximado del Header (80px) y evitar el scroll.
      // 2. Cambiamos bg-bottom por bg-center para que el sol y las palmeras sean los protagonistas.
      className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center relative bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/images/neon-sunset-bg.jpg')" }} 
    >
      {/* Velo oscuro sutil para no opacar los colores vibrantes */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      <main className="w-full relative z-10 flex items-center justify-center px-4 py-6">
        {children}
      </main>
    </div>
  );
}