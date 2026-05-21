"use client";

import { useEffect, useState, useTransition } from "react";
import { updateProduct } from "@/actions/products";
import { he } from "@/lib/i18n/admin-he";
import type { ProductInput } from "@/lib/validators/product";
import type { AdminProduct } from "@/actions/products";

type ProductEditModalProps = {
  product: AdminProduct;
  categories: { id: number; name: string }[];
  onClose: () => void;
  onSuccess: () => void;
};

export function ProductEditModal({
  product,
  categories,
  onClose,
  onSuccess,
}: ProductEditModalProps) {
  const [form, setForm] = useState<ProductInput>({
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    categoryId: product.categoryId,
    isAvailable: product.isAvailable,
  });
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleChange(
    field: keyof ProductInput,
    value: string | number | boolean,
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await updateProduct(product.id, form);
      if (!result.success) {
        setError(result.error);
        return;
      }
      onSuccess();
      onClose();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal
      aria-labelledby="edit-product-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 id="edit-product-title" className="text-lg font-semibold text-slate-900">
            {he.products.editModalTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
            aria-label={he.products.closeModal}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-name" className="text-sm font-medium text-slate-700">
              {he.products.name}
            </label>
            <input
              id="edit-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={he.products.namePlaceholder}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="edit-price" className="text-sm font-medium text-slate-700">
                {he.products.price}
              </label>
              <input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                required
                dir="ltr"
                value={form.price || ""}
                onChange={(e) =>
                  handleChange("price", parseFloat(e.target.value) || 0)
                }
                placeholder={he.products.pricePlaceholder}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="edit-category" className="text-sm font-medium text-slate-700">
                {he.products.category}
              </label>
              <select
                id="edit-category"
                required
                value={form.categoryId}
                onChange={(e) =>
                  handleChange("categoryId", parseInt(e.target.value, 10))
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">{he.products.categoryPlaceholder}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="edit-imageUrl" className="text-sm font-medium text-slate-700">
              {he.products.imageUrl}
            </label>
            <input
              id="edit-imageUrl"
              type="url"
              required
              dir="ltr"
              value={form.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder={he.products.imageUrlPlaceholder}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.isAvailable ?? true}
              onChange={(e) => handleChange("isAvailable", e.target.checked)}
              className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-slate-700">
              {he.products.availabilityLabel}
            </span>
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {isPending ? he.products.saving : he.products.update}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {he.products.cancelEdit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
