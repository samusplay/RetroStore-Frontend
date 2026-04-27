// app/catalogo/retro-tv/layout.tsx
export default function RetroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="h-screen w-screen overflow-hidden bg-black">
      {children}
    </section>
  );
}