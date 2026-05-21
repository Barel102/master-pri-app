import { getCategories } from "@/actions/categories";
import { CategoriesManager } from "@/components/admin/categories-manager";
import { he } from "@/lib/i18n/admin-he";

export const metadata = {
  title: `${he.categories.title} | ${he.appName}`,
};

export default async function AdminCategoriesPage() {
  const result = await getCategories();
  const categories = result.success ? result.data : [];

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{he.categories.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{he.categories.subtitle}</p>
      </header>

      <CategoriesManager initialCategories={categories} />
    </div>
  );
}
