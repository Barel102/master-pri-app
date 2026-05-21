"use client";

import Link from "next/link";
import { useCartItems, useCartItemCount, useCartTotal } from "@/store/cart-store";
import { CartLineItem } from "@/components/store/cart-line-item";
import { storeHe } from "@/lib/i18n/store-he";

type CartPanelProps = {
  onCheckout?: () => void;
  className?: string;
  variant?: "sidebar" | "sheet";
};

export function CartPanel({
  onCheckout,
  className = "",
  variant = "sidebar",
}: CartPanelProps) {
  const items = useCartItems();
  const itemCount = useCartItemCount();
  const total = useCartTotal();

  return (
    <div className={`flex h-full flex-col bg-white ${className}`}>
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-bold text-gray-900">{storeHe.cart.title}</h2>
        {itemCount > 0 && (
          <p className="mt-0.5 text-sm text-gray-500">
            {itemCount} {storeHe.cart.items}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="font-semibold text-gray-700">{storeHe.cart.empty}</p>
            <p className="mt-1 text-sm text-gray-500">{storeHe.cart.emptyHint}</p>
          </div>
        ) : (
          <ul>
            {items.map((item) => (
              <CartLineItem key={item.productId} item={item} />
            ))}
          </ul>
        )}
      </div>

      <div
        className={`border-t border-gray-200 p-5 ${
          variant === "sheet" ? "bg-white" : "bg-gray-50"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="font-semibold text-gray-800">{storeHe.cart.total}</span>
          <span className="text-xl font-bold text-[#007934]" dir="ltr">
            ₪{total.toFixed(2)}
          </span>
        </div>

        <Link
          href="/checkout"
          onClick={onCheckout}
          className={`flex min-h-12 w-full items-center justify-center rounded-lg bg-[#007934] px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-[#006b2d] active:bg-[#005a26] ${
            items.length === 0 ? "pointer-events-none opacity-50" : ""
          }`}
          aria-disabled={items.length === 0}
          tabIndex={items.length === 0 ? -1 : 0}
        >
          {storeHe.cart.checkout}
        </Link>
      </div>
    </div>
  );
}
