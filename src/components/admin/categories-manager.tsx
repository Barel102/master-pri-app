"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { createCategory, deleteCategory } from "@/actions/categories";
import type { CategoryRow } from "@/actions/categories";
import { he } from "@/lib/i18n/admin-he";

type CategoriesManagerProps = {
  initialCategories: CategoryRow[];
};

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await createCategory(name);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setName("");
      router.refresh();
    });
  }

  function handleDelete(id: number) {
    if (!window.confirm(he.categories.deleteConfirm)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteCategory(id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {he.categories.add}
        </h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="categoryName" className="text-sm font-medium text-slate-700">
              {he.categories.name}
            </label>
            <input
              id="categoryName"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={he.categories.namePlaceholder}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {isPending ? he.categories.adding : he.categories.add}
          </button>
        </form>
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {he.categories.listTitle}
          </h2>
        </div>

        {categories.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-500">
            {he.categories.empty}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="px-4 py-3 text-start font-medium">{he.categories.name}</th>
                  <th className="px-4 py-3 text-start font-medium">
                    {he.categories.productCount}
                  </th>
                  <th className="px-4 py-3 text-start font-medium">
                    {he.categories.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {category.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {category._count.products}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(category.id)}
                        disabled={isPending}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                      >
                        {he.categories.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
