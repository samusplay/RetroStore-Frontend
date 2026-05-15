'use client';

import RetroProductCard from './RetroProductCard';

interface ProductGridProps {
  products: any[];
  onRefresh: () => void;
}

export default function ProductGrid({ products, onRefresh }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <div className="w-full py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16 max-w-7xl mx-auto">
        {products.map((product) => (
          <RetroProductCard key={product.id} product={product} onRefresh={onRefresh} />
        ))}
      </div>
    </div>
  );
}