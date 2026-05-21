"use client";

import { useMemo } from "react";
import { ProductCard } from "@/components/store/product-card";
import { useStoreUI } from "@/components/store/store-ui-context";
import type { StoreProduct } from "@/actions/store";

type ProductGridProps = {
  products: StoreProduct[];
};

export function ProductGrid({ products }: ProductGridProps) {
  const { activeFilter, searchQuery } = useStoreUI();

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeFilter !== "all") {
      result = result.filter((p) => p.categoryId === activeFilter);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((p) => p.name.toLowerCase().includes(query));
    }

    return result;
  }, [products, activeFilter, searchQuery]);

  return (
    <div>
      {filteredProducts.length === 0 ? (
        <p className="rounded-lg border border-gray-200 bg-white p-10 text-center text-gray-500">
          {searchQuery.trim()
            ? "לא נמצאו מוצרים התואמים לחיפוש."
            : "אין מוצרים בקטגוריה זו כרגע."}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
