"use server";

import { revalidatePath } from "next/cache";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/actions/types";
import { withAdminAuth } from "@/lib/actions/guard";
import { prisma } from "@/lib/prisma";

const REVALIDATE_PATHS = ["/admin/categories", "/admin/products", "/"];

function revalidateCategoryViews() {
  for (const path of REVALIDATE_PATHS) {
    revalidatePath(path);
  }
}

export type CategoryRow = {
  id: number;
  name: string;
  _count: { products: number };
};

export async function getCategories(): Promise<ActionResult<CategoryRow[]>> {
  return withAdminAuth(async () => {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
    return actionSuccess(categories);
  });
}

export async function getCategoriesForSelect(): Promise<
  ActionResult<{ id: number; name: string }[]>
> {
  return withAdminAuth(async () => {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
    return actionSuccess(categories);
  });
}

export async function createCategory(
  name: string,
): Promise<ActionResult<{ id: number; name: string }>> {
  return withAdminAuth(async () => {
    const trimmed = name?.trim();

    if (!trimmed) {
      return actionError("שם הקטגוריה הוא שדה חובה.");
    }

    const existing = await prisma.category.findUnique({
      where: { name: trimmed },
    });

    if (existing) {
      return actionError("קטגוריה בשם זה כבר קיימת.");
    }

    const category = await prisma.category.create({
      data: { name: trimmed },
    });

    revalidateCategoryViews();
    return actionSuccess({ id: category.id, name: category.name });
  });
}

export async function deleteCategory(
  id: number,
): Promise<ActionResult<{ id: number }>> {
  return withAdminAuth(async () => {
    if (!Number.isInteger(id) || id <= 0) {
      return actionError("מזהה קטגוריה לא תקין.");
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      return actionError("הקטגוריה לא נמצאה.");
    }

    if (category._count.products > 0) {
      return actionError(
        `לא ניתן למחוק קטגוריה עם ${category._count.products} מוצרים. העבירו או מחקו את המוצרים תחילה.`,
      );
    }

    await prisma.category.delete({ where: { id } });
    revalidateCategoryViews();
    return actionSuccess({ id });
  });
}
