import { storeHe } from "@/lib/i18n/store-he";

export function StorePromoBanner() {
  return (
    <section className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-5xl lg:max-w-none">
        <p className="text-center text-sm font-semibold text-gray-800 sm:text-base">
          {storeHe.hero.title}
        </p>
      </div>
    </section>
  );
}
