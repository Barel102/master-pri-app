"use client";

import Image from "next/image";
import { memo } from "react";
import { useCartActions, useProductQuantity } from "@/store/cart-store";
import { storeHe } from "@/lib/i18n/store-he";
import type { StoreProduct } from "@/actions/store";

type ProductCardProps = {
  product: StoreProduct;
};

function ProductCardComponent({ product }: ProductCardProps) {
  const quantity = useProductQuantity(product.id);
  const { addItem, decreaseItem } = useCartActions();

  const lineTotal = product.price * (quantity > 0 ? quantity : 1);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
  }

  return (
    <article className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-4">
      <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg bg-white sm:h-40">
        <div className="relative h-full w-full p-4">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 45vw, 200px"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col text-right">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 sm:text-base">
          {product.name}
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {storeHe.product.priceByWeight} | {product.categoryName}
        </p>

        <div className="mt-3">
          <p className="text-2xl font-bold leading-none text-gray-900" dir="ltr">
            ₪{lineTotal.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-gray-500" dir="ltr">
            ₪{product.price.toFixed(2)} {storeHe.product.pricePerKg}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleAdd}
            className="shrink-0 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-700 active:bg-rose-800"
          >
            {storeHe.product.add}
          </button>

          <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={() => decreaseItem(product.id)}
              disabled={quantity === 0}
              aria-label={storeHe.product.remove}
              className="flex size-9 items-center justify-center text-lg font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              −
            </button>

            <span
              className="min-w-[3.5rem] px-1 text-center text-sm font-semibold tabular-nums text-gray-800"
              aria-live="polite"
            >
              {quantity} {storeHe.product.perUnit}
            </span>

            <button
              type="button"
              onClick={handleAdd}
              aria-label={storeHe.product.add}
              className="flex size-9 items-center justify-center text-lg font-medium text-gray-600 transition-colors hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardComponent);
