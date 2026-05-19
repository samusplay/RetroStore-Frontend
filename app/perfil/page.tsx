import { ProductForm } from "./components/ProductForm";

// Metadata para SEO interno
export const metadata = {
  title: "RetroStore | Gestionar Inventario",
  description: "Panel de control para vendedores de RetroStore",
};

export default function PerfilPage() {
  return (
    <div className="flex flex-col items-center">
      <ProductForm />
    </div>
  );
}