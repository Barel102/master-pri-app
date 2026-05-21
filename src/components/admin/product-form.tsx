"use client";

import { useState, useTransition } from "react";
import { createProduct } from "@/actions/products";
import { he } from "@/lib/i18n/admin-he";
import type { ProductInput } from "@/lib/validators/product";

const emptyForm: ProductInput = {
  name: "",
  price: 0,
  imageUrl: "",
  categoryId: 0,
  isAvailable: true,
};

type ProductFormProps = {
  categories: { id: number; name: string }[];
  onSuccess: () => void;
};

export function ProductForm({ categories, onSuccess }: ProductFormProps) {
  const [form, setForm] = useState<ProductInput>({
    ...emptyForm,
    categoryId: categories[0]?.id ?? 0,
  });
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

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
      const result = await createProduct(form);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setForm({
        ...emptyForm,
        categoryId: categories[0]?.id ?? 0,
      });
      onSuccess();
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-slate-900">
        {he.products.formTitle}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              {he.products.name}
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={he.products.namePlaceholder}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="price" className="text-sm font-medium text-slate-700">
              {he.products.price}
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              required
              dir="ltr"
              value={form.price || ""}
              onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
              placeholder={he.products.pricePlaceholder}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-medium text-slate-700">
              {he.products.category}
            </label>
            <select
              id="category"
              required
              value={form.categoryId || ""}
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

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="imageUrl" className="text-sm font-medium text-slate-700">
              {he.products.imageUrl}
            </label>
            <input
              id="imageUrl"
              type="url"
              required
              dir="ltr"
              value={form.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder={he.products.imageUrlPlaceholder}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
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
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={isPending || categories.length === 0}
          className="w-full rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 sm:w-auto"
        >
          {isPending ? he.products.saving : he.products.save}
        </button>

        {categories.length === 0 && (
          <p className="text-sm text-amber-700">
            יש ליצור קטגוריה לפני הוספת מוצרים.
          </p>
        )}
      </form>
    </div>
  );
}
