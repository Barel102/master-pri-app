"use client";

import { useEffect, useState } from "react";
import { CartPanel } from "@/components/store/cart-panel";
import { CartIcon, CloseIcon } from "@/components/store/icons";
import { useCartItemCount } from "@/store/cart-store";
import { storeHe } from "@/lib/i18n/store-he";

export function CartMobile() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const itemCount = useCartItemCount();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex size-16 items-center justify-center rounded-full bg-[#007934] text-white shadow-lg shadow-green-700/30 transition-transform duration-200 hover:scale-105 hover:bg-[#006b2d] active:scale-95 lg:hidden"
        aria-label={storeHe.cart.shoppingCart}
      >
        <CartIcon className="size-7" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white ring-2 ring-white">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal>
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
            aria-label={storeHe.cart.close}
          />

          <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col overflow-hidden rounded-t-2xl border-t border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-center py-3">
              <span className="h-1 w-12 rounded-full bg-gray-300" aria-hidden />
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-3 end-3 flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              aria-label={storeHe.cart.close}
            >
              <CloseIcon />
            </button>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <CartPanel onCheckout={() => setIsOpen(false)} variant="sheet" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
