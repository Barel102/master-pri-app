import { getStoreProducts } from "@/actions/store";
import { ProductGrid } from "@/components/store/product-grid";
import { StorePromoBanner } from "@/components/store/store-promo-banner";

export default async function StoreHomePage() {
  const products = await getStoreProducts();

  return (
    <>
      <StorePromoBanner />
      <main className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:max-w-none lg:pe-6 lg:ps-6">
        <div id="shop">
          {products.length === 0 ? (
            <p className="rounded-lg border border-gray-200 bg-white p-10 text-center text-gray-500">
              אין מוצרים זמינים כרגע. חזרו בקרוב!
            </p>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </main>
    </>
  );
}
