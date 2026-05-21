"use client";

import Image from "next/image";
import { memo } from "react";
import type { CartItem } from "@/store/cart-store";
import { useCartActions } from "@/store/cart-store";
import { storeHe } from "@/lib/i18n/store-he";

type CartLineItemProps = {
  item: CartItem;
};

function CartLineItemComponent({ item }: CartLineItemProps) {
  const { addItem, decreaseItem, removeItem } = useCartActions();

  return (
    <li className="flex gap-3 border-b border-gray-100 py-4 last:border-0">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-gray-900">{item.name}</p>
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            aria-label={storeHe.cart.removeItem}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <TrashIcon />
          </button>
        </div>

        <p className="text-sm font-bold text-gray-900" dir="ltr">
          ₪{(item.price * item.quantity).toFixed(2)}
        </p>

        <div className="flex min-h-9 w-full overflow-hidden rounded-lg border border-[#007934]">
          <button
            type="button"
            onClick={() => decreaseItem(item.productId)}
            aria-label={storeHe.product.remove}
            className="flex flex-1 items-center justify-center bg-[#007934] text-lg font-bold text-white hover:bg-[#006b2d]"
          >
            −
          </button>
          <span className="flex flex-1 items-center justify-center bg-white text-base font-bold tabular-nums text-gray-900">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() =>
              addItem({
                productId: item.productId,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
              })
            }
            aria-label={storeHe.product.add}
            className="flex flex-1 items-center justify-center bg-[#007934] text-lg font-bold text-white hover:bg-[#006b2d]"
          >
            +
          </button>
        </div>
      </div>
    </li>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden
    >
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

export const CartLineItem = memo(CartLineItemComponent);
