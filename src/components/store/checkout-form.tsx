"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/actions/store";
import {
  useCartItems,
  useCartTotal,
  useCartStore,
} from "@/store/cart-store";
import { storeHe } from "@/lib/i18n/store-he";

const inputClassName =
  "min-h-12 w-full rounded-lg border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#007934] focus:ring-2 focus:ring-[#007934]/20";

const buttonPrimaryClassName =
  "flex min-h-12 w-full items-center justify-center rounded-lg bg-[#007934] px-6 py-4 text-base font-bold text-white transition-colors hover:bg-[#006b2d] active:bg-[#005a26] disabled:cursor-not-allowed disabled:opacity-50";

const cardClassName =
  "rounded-lg border border-gray-200 bg-white p-6 sm:p-7";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartItems();
  const total = useCartTotal();
  const clearCart = useCartStore((s) => s.clearCart);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  if (items.length === 0 && !isSuccess) {
    return (
      <div className={`${cardClassName} p-10 text-center`}>
        <p className="text-lg text-stone-600">{storeHe.checkout.emptyCart}</p>
        <Link href="/" className={`mt-8 ${buttonPrimaryClassName} max-w-xs mx-auto`}>
          {storeHe.checkout.backToShop}
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={`${cardClassName} p-10 text-center shadow-md`}>
        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-green-50 text-4xl text-[#007934]">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {storeHe.checkout.successTitle}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-gray-600">
          {storeHe.checkout.successMessage}
        </p>
        {orderId && (
          <p className="mt-3 text-sm font-medium text-[#007934]">
            מספר הזמנה: #{orderId}
          </p>
        )}
        <Link href="/" className={`mt-8 ${buttonPrimaryClassName} max-w-xs mx-auto`}>
          {storeHe.checkout.backToShop}
        </Link>
      </div>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await createOrder(
        { customerName, phone, address, notes },
        items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      setOrderId(result.data.orderId);
      clearCart();
      setIsSuccess(true);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className={cardClassName}>
        <h2 className="mb-5 text-lg font-bold text-gray-900">
          {storeHe.checkout.orderSummary}
        </h2>
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex items-center justify-between gap-4 text-base text-gray-700"
            >
              <span className="font-medium">
                {item.name} × {item.quantity}
              </span>
              <span dir="ltr" className="shrink-0 font-bold text-[#007934]">
                ₪{(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
          <span className="text-base font-semibold text-gray-800">
            {storeHe.cart.total}
          </span>
          <span className="text-xl font-bold text-[#007934]" dir="ltr">
            ₪{total.toFixed(2)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={cardClassName}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-semibold text-gray-700">
              {storeHe.checkout.name}
            </label>
            <input
              id="name"
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={storeHe.checkout.namePlaceholder}
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-semibold text-gray-700">
              {storeHe.checkout.phone}
            </label>
            <input
              id="phone"
              type="tel"
              required
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={storeHe.checkout.phonePlaceholder}
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="address" className="text-sm font-semibold text-gray-700">
              {storeHe.checkout.address}
            </label>
            <input
              id="address"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={storeHe.checkout.addressPlaceholder}
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="notes" className="text-sm font-semibold text-gray-700">
              {storeHe.checkout.notes}
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={storeHe.checkout.notesPlaceholder}
              className={`${inputClassName} resize-none`}
            />
          </div>
        </div>

        {error && (
          <p
            className="mt-5 rounded-2xl bg-red-50 px-4 py-3.5 text-sm font-medium text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className={`mt-6 ${buttonPrimaryClassName}`}
        >
          {isPending ? storeHe.checkout.submitting : storeHe.checkout.submit}
        </button>
      </form>
    </div>
  );
}
