"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { deleteProduct } from "@/actions/products";
import type { AdminProduct } from "@/actions/products";
import { ProductEditModal } from "@/components/admin/product-edit-modal";
import { he } from "@/lib/i18n/admin-he";

type ProductsManagerProps = {
  initialProducts: AdminProduct[];
  categories: { id: number; name: string }[];
};

export function ProductsManager({
  initialProducts,
  categories,
}: ProductsManagerProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  function refresh() {
    router.refresh();
  }

  function handleDelete(id: number) {
    if (!window.confirm(he.products.deleteConfirm)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        if (editingProduct?.id === id) {
          setEditingProduct(null);
        }
        refresh();
      }
    });
  }

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {he.products.tableTitle}
          </h2>
        </div>

        {products.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-500">
            {he.products.empty}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="px-4 py-3 text-start font-medium">{he.products.image}</th>
                  <th className="px-4 py-3 text-start font-medium">{he.products.name}</th>
                  <th className="px-4 py-3 text-start font-medium">{he.products.category}</th>
                  <th className="px-4 py-3 text-start font-medium">{he.products.price}</th>
                  <th className="px-4 py-3 text-start font-medium">{he.products.availability}</th>
                  <th className="px-4 py-3 text-start font-medium">{he.products.actions}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3">
                      <div className="relative size-12 overflow-hidden rounded-lg bg-slate-100">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="flex size-full items-center justify-center text-xs text-slate-400">
                            {he.products.noImage}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {product.category.name}
                    </td>
                    <td className="px-4 py-3 text-slate-900" dir="ltr">
                      ₪{product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          product.isAvailable
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {product.isAvailable
                          ? he.products.available
                          : he.products.unavailable}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(product)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          {he.products.edit}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          disabled={isPending}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                        >
                          {he.products.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
          onSuccess={refresh}
        />
      )}
    </>
  );
}
