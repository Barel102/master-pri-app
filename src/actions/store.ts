"use server";

import { revalidatePath } from "next/cache";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/actions/types";
import { prisma } from "@/lib/prisma";
import {
  validateCartLines,
  validateCheckoutInput,
  type CartLineInput,
  type CheckoutInput,
} from "@/lib/validators/order";

export type StoreCategory = {
  id: number;
  name: string;
};

export type StoreProduct = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  categoryId: number;
  categoryName: string;
};

export async function getStoreCategories(): Promise<StoreCategory[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return categories;
}

export async function getStoreProducts(): Promise<StoreProduct[]> {
  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    include: { category: { select: { id: true, name: true } } },
    orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    imageUrl: p.imageUrl,
    isAvailable: p.isAvailable,
    categoryId: p.categoryId,
    categoryName: p.category.name,
  }));
}

export async function createOrder(
  checkout: CheckoutInput,
  cartItems: CartLineInput[],
): Promise<ActionResult<{ orderId: number }>> {
  const validatedCheckout = validateCheckoutInput(checkout);
  if (!validatedCheckout.success) {
    return validatedCheckout;
  }

  const validatedCart = validateCartLines(cartItems);
  if (!validatedCart.success) {
    return validatedCart;
  }

  const productIds = validatedCart.data.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isAvailable: true,
    },
  });

  if (products.length !== productIds.length) {
    return actionError("חלק מהמוצרים אינם זמינים יותר. אנא רעננו את העגלה.");
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  let totalAmount = 0;
  const orderItemsData = validatedCart.data.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error("Product not found");
    }
    totalAmount += product.price * item.quantity;
    return {
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
    };
  });

  const order = await prisma.order.create({
    data: {
      customerName: validatedCheckout.data.customerName,
      phone: validatedCheckout.data.phone,
      address: validatedCheckout.data.address,
      notes: validatedCheckout.data.notes,
      totalAmount,
      status: "Pending",
      items: {
        create: orderItemsData,
      },
    },
  });

  revalidatePath("/admin/orders");

  return actionSuccess({ orderId: order.id });
}
