"use server";

import { revalidatePath } from "next/cache";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/actions/types";
import { withAdminAuth } from "@/lib/actions/guard";
import { prisma } from "@/lib/prisma";
import {
  validateProductInput,
  type ProductInput,
} from "@/lib/validators/product";

const productInclude = {
  category: { select: { id: true, name: true } },
} as const;

const ADMIN_PATHS = ["/admin", "/admin/products", "/"];

function revalidateProductViews() {
  for (const path of ADMIN_PATHS) {
    revalidatePath(path);
  }
}

export type AdminProduct = Awaited<
  ReturnType<typeof prisma.product.findMany<{ include: typeof productInclude }>>
>[number];

export async function getProducts(): Promise<ActionResult<AdminProduct[]>> {
  return withAdminAuth(async () => {
    const products = await prisma.product.findMany({
      include: productInclude,
      orderBy: { id: "desc" },
    });
    return actionSuccess(products);
  });
}

export async function getProduct(
  id: number,
): Promise<ActionResult<AdminProduct | null>> {
  return withAdminAuth(async () => {
    if (!Number.isInteger(id) || id <= 0) {
      return actionError("מזהה מוצר לא תקין.");
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });

    if (!product) {
      return actionError("המוצר לא נמצא.");
    }

    return actionSuccess(product);
  });
}

export async function createProduct(
  input: ProductInput,
): Promise<ActionResult<AdminProduct>> {
  return withAdminAuth(async () => {
    const validated = validateProductInput(input);
    if (!validated.success) {
      return validated;
    }

    const category = await prisma.category.findUnique({
      where: { id: validated.data.categoryId },
    });

    if (!category) {
      return actionError("הקטגוריה שנבחרה לא קיימת.");
    }

    const product = await prisma.product.create({
      data: validated.data,
      include: productInclude,
    });

    revalidateProductViews();
    return actionSuccess(product);
  });
}

export async function updateProduct(
  id: number,
  input: ProductInput,
): Promise<ActionResult<AdminProduct>> {
  return withAdminAuth(async () => {
    if (!Number.isInteger(id) || id <= 0) {
      return actionError("מזהה מוצר לא תקין.");
    }

    const validated = validateProductInput(input);
    if (!validated.success) {
      return validated;
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return actionError("המוצר לא נמצא.");
    }

    const category = await prisma.category.findUnique({
      where: { id: validated.data.categoryId },
    });

    if (!category) {
      return actionError("הקטגוריה שנבחרה לא קיימת.");
    }

    const product = await prisma.product.update({
      where: { id },
      data: validated.data,
      include: productInclude,
    });

    revalidateProductViews();
    return actionSuccess(product);
  });
}

export async function deleteProduct(
  id: number,
): Promise<ActionResult<{ id: number }>> {
  return withAdminAuth(async () => {
    if (!Number.isInteger(id) || id <= 0) {
      return actionError("מזהה מוצר לא תקין.");
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return actionError("המוצר לא נמצא.");
    }

    await prisma.product.delete({ where: { id } });
    revalidateProductViews();
    return actionSuccess({ id });
  });
}
