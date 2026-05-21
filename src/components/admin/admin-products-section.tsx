"use client";

import { useRouter } from "next/navigation";
import type { AdminProduct } from "@/actions/products";
import { ProductForm } from "@/components/admin/product-form";
import { ProductsManager } from "@/components/admin/products-manager";

type AdminProductsSectionProps = {
  products: AdminProduct[];
  categories: { id: number; name: string }[];
};

export function AdminProductsSection({
  products,
  categories,
}: AdminProductsSectionProps) {
  const router = useRouter();

  function handleRefresh() {
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-8">
      <ProductForm categories={categories} onSuccess={handleRefresh} />
      <ProductsManager
        initialProducts={products}
        categories={categories}
      />
    </div>
  );
}
