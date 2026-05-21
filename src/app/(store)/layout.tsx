import { Assistant } from "next/font/google";
import { getStoreCategories } from "@/actions/store";
import { CartDesktopSidebar } from "@/components/store/cart-desktop-sidebar";
import { CartMobile } from "@/components/store/cart-mobile";
import { StoreNavigation } from "@/components/store/store-navigation";
import { StoreUIProvider } from "@/components/store/store-ui-context";
import { storeHe } from "@/lib/i18n/store-he";

/** DB-backed layout; skip static prerender on Vercel build without DATABASE_URL */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
});

export const metadata = {
  title: storeHe.appName,
  description: storeHe.tagline,
};

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getStoreCategories();

  return (
    <div
      lang="he"
      dir="rtl"
      className={`${assistant.variable} min-h-screen bg-gray-50 font-sans text-gray-900 antialiased`}
      style={{ fontFamily: "var(--font-assistant), Arial, sans-serif" }}
    >
      <StoreUIProvider categories={categories}>
        <StoreNavigation />
        <CartDesktopSidebar />
        <div className="pb-24 lg:pb-8 lg:pl-80">{children}</div>
        <CartMobile />
      </StoreUIProvider>
    </div>
  );
}
