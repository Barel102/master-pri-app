import { getCategoriesForSelect } from "@/actions/categories";
import { getProducts } from "@/actions/products";
import { AdminProductsSection } from "@/components/admin/admin-products-section";
import { he } from "@/lib/i18n/admin-he";

export const metadata = {
  title: `${he.products.title} | ${he.appName}`,
};

export default async function AdminProductsPage() {
  const [productsResult, categoriesResult] = await Promise.all([
    getProducts(),
    getCategoriesForSelect(),
  ]);

  const products = productsResult.success ? productsResult.data : [];
  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{he.products.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{he.products.subtitle}</p>
      </header>

      <AdminProductsSection products={products} categories={categories} />
    </div>
  );
}
