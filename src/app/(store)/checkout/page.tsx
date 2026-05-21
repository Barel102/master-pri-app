import Link from "next/link";
import { CheckoutForm } from "@/components/store/checkout-form";
import { storeHe } from "@/lib/i18n/store-he";

export const metadata = {
  title: `${storeHe.checkout.title} | ${storeHe.appName}`,
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-lg bg-gray-50 px-4 py-6 sm:px-6 sm:py-8 lg:max-w-none">
      <Link
        href="/"
        className="mb-6 inline-flex min-h-10 items-center text-sm font-semibold text-[#007934] hover:text-[#006b2d]"
      >
        ← {storeHe.cart.continueShopping}
      </Link>

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {storeHe.checkout.title}
        </h1>
        <p className="mt-2 text-base text-gray-600">{storeHe.checkout.subtitle}</p>
      </header>

      <CheckoutForm />
    </main>
  );
}
