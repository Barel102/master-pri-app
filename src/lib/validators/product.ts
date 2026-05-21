import type { ActionResult } from "@/lib/actions/types";
import { actionError } from "@/lib/actions/types";

export type ProductInput = {
  name: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  isAvailable?: boolean;
};

export function validateProductInput(
  input: ProductInput,
): ActionResult<Omit<ProductInput, "categoryId"> & { categoryId: number }> {
  const name = input.name?.trim();
  const imageUrl = input.imageUrl?.trim();

  if (!name) {
    return actionError("שם המוצר הוא שדה חובה.");
  }

  if (!Number.isFinite(input.price) || input.price <= 0) {
    return actionError("המחיר חייב להיות מספר חיובי.");
  }

  if (!imageUrl) {
    return actionError("כתובת תמונה היא שדה חובה.");
  }

  if (!Number.isInteger(input.categoryId) || input.categoryId <= 0) {
    return actionError("יש לבחור קטגוריה.");
  }

  return {
    success: true,
    data: {
      name,
      price: input.price,
      imageUrl,
      categoryId: input.categoryId,
      isAvailable: input.isAvailable ?? true,
    },
  };
}
