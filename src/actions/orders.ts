"use server";

import { revalidatePath } from "next/cache";
import {
  actionError,
  actionSuccess,
  type ActionResult,
  type OrderStatus,
  UPDATABLE_ORDER_STATUSES,
} from "@/lib/actions/types";
import { withAdminAuth } from "@/lib/actions/guard";
import { prisma } from "@/lib/prisma";

const ADMIN_PATHS = ["/admin", "/admin/orders"];

function revalidateAdminOrderViews() {
  for (const path of ADMIN_PATHS) {
    revalidatePath(path);
  }
}

const orderInclude = {
  items: {
    include: {
      product: true,
    },
  },
} as const;

export type OrderWithItems = Awaited<
  ReturnType<
    typeof prisma.order.findMany<{ include: typeof orderInclude }>
  >
>[number];

export async function getOrders(): Promise<ActionResult<OrderWithItems[]>> {
  return withAdminAuth(async () => {
    const orders = await prisma.order.findMany({
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });
    return actionSuccess(orders);
  });
}

export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus,
): Promise<
  ActionResult<Awaited<ReturnType<typeof prisma.order.update>>>
> {
  return withAdminAuth(async () => {
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return actionError("Invalid order ID.");
    }

    if (status === "Cancelled") {
      return actionError(
        "Use cancelOrder to cancel an order. Status cannot be set to Cancelled through updateOrderStatus.",
      );
    }

    if (
      !UPDATABLE_ORDER_STATUSES.includes(
        status as (typeof UPDATABLE_ORDER_STATUSES)[number],
      )
    ) {
      return actionError(
        `Invalid status. Allowed values: ${UPDATABLE_ORDER_STATUSES.join(", ")}.`,
      );
    }

    const existing = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existing) {
      return actionError("Order not found.");
    }

    if (existing.status === "Cancelled") {
      return actionError("Cannot update status of a cancelled order.");
    }

    if (existing.status === "Delivered" && status !== "Delivered") {
      return actionError("Cannot change status of a delivered order.");
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: orderInclude,
    });

    revalidateAdminOrderViews();
    return actionSuccess(order);
  });
}

export async function cancelOrder(
  orderId: number,
): Promise<
  ActionResult<Awaited<ReturnType<typeof prisma.order.update>>>
> {
  return withAdminAuth(async () => {
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return actionError("Invalid order ID.");
    }

    const existing = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existing) {
      return actionError("Order not found.");
    }

    if (existing.status === "Cancelled") {
      return actionError("Order is already cancelled.");
    }

    if (existing.status === "Delivered") {
      return actionError("Cannot cancel a delivered order.");
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: "Cancelled" },
      include: orderInclude,
    });

    revalidateAdminOrderViews();
    return actionSuccess(order);
  });
}
