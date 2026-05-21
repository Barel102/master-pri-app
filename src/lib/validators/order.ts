import { actionError, type ActionResult } from "@/lib/actions/types";

export type CheckoutInput = {
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
};

export type CartLineInput = {
  productId: number;
  quantity: number;
};

export function validateCheckoutInput(
  input: CheckoutInput,
): ActionResult<CheckoutInput> {
  const customerName = input.customerName?.trim();
  const phone = input.phone?.trim();
  const address = input.address?.trim();
  const notes = input.notes?.trim();

  if (!customerName) {
    return actionError("שם מלא הוא שדה חובה.");
  }

  if (!phone) {
    return actionError("טלפון הוא שדה חובה.");
  }

  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 9) {
    return actionError("מספר טלפון לא תקין.");
  }

  if (!address) {
    return actionError("כתובת למשלוח היא שדה חובה.");
  }

  return {
    success: true,
    data: {
      customerName,
      phone,
      address,
      notes: notes || undefined,
    },
  };
}

export function validateCartLines(
  items: CartLineInput[],
): ActionResult<CartLineInput[]> {
  if (!items.length) {
    return actionError("העגלה ריקה.");
  }

  for (const item of items) {
    if (!Number.isInteger(item.productId) || item.productId <= 0) {
      return actionError("פריט לא תקין בעגלה.");
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return actionError("כמות לא תקינה בעגלה.");
    }
  }

  return { success: true, data: items };
}
