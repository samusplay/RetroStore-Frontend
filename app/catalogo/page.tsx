// app/catalogo/page.tsx
import CatalogHeader from './components/CatalogHeader';
import ProductGrid from './components/ProductGrid';

export default function CatalogoPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Inyectamos la cabecera Cyberpunk */}
      <CatalogHeader />
      
      {/* Inyectamos la grilla de productos (que hace el fetch) */}
      <ProductGrid />
    </div>
  );
}