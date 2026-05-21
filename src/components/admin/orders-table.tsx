"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  cancelOrder,
  updateOrderStatus,
  type OrderWithItems,
} from "@/actions/orders";
import type { OrderStatus } from "@/lib/actions/types";
import {
  he,
  orderStatusColors,
  orderStatusLabels,
} from "@/lib/i18n/admin-he";

type OrdersTableProps = {
  initialOrders: OrderWithItems[];
};

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function OrdersTable({ initialOrders }: OrdersTableProps) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  function refresh() {
    router.refresh();
  }

  function handleStatusChange(orderId: number, status: OrderStatus) {
    setError("");
    setPendingId(orderId);

    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status);
      setPendingId(null);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: result.data.status } : o)),
      );
      refresh();
    });
  }

  function handleCancel(orderId: number) {
    if (!window.confirm(he.orders.cancelConfirm)) {
      return;
    }

    setError("");
    setPendingId(orderId);

    startTransition(async () => {
      const result = await cancelOrder(orderId);
      setPendingId(null);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" } : o)),
      );
      refresh();
    });
  }

  const isActionDisabled = (order: OrderWithItems) =>
    isPending ||
    order.status === "Cancelled" ||
    order.status === "Delivered";

  if (orders.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
        {he.orders.empty}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <div className="flex flex-col gap-6">
        {orders.map((order) => {
          const status = order.status as OrderStatus;
          const loading = pendingId === order.id && isPending;

          return (
            <article
              key={order.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-500">{he.orders.orderId}</p>
                  <p className="text-lg font-bold text-slate-900">#{order.id}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                </div>

                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${orderStatusColors[status] ?? "bg-slate-100 text-slate-700"}`}
                >
                  {orderStatusLabels[status] ?? order.status}
                </span>
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-500">{he.orders.customer}</p>
                  <p className="font-medium text-slate-900">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">{he.orders.phone}</p>
                  <p className="font-medium text-slate-900" dir="ltr">
                    {order.phone}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-slate-500">{he.orders.address}</p>
                  <p className="font-medium text-slate-900">{order.address}</p>
                </div>
                {order.notes && (
                  <div className="sm:col-span-2 lg:col-span-4">
                    <p className="text-xs text-slate-500">{he.orders.notes}</p>
                    <p className="text-slate-700">{order.notes}</p>
                  </div>
                )}
              </div>

              <div className="mb-4 overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full min-w-[400px] text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600">
                      <th className="px-4 py-2 text-start font-medium">{he.products.name}</th>
                      <th className="px-4 py-2 text-start font-medium">{he.orders.quantity}</th>
                      <th className="px-4 py-2 text-start font-medium">{he.products.price}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-t border-slate-100">
                        <td className="px-4 py-2 text-slate-900">{item.product.name}</td>
                        <td className="px-4 py-2 text-slate-700">{item.quantity}</td>
                        <td className="px-4 py-2 text-slate-900" dir="ltr">
                          ₪{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mb-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-medium text-slate-600">{he.orders.total}</span>
                <span className="text-lg font-bold text-slate-900" dir="ltr">
                  ₪{order.totalAmount.toFixed(2)}
                </span>
              </div>

              {order.status !== "Cancelled" && order.status !== "Delivered" && (
                <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                  <span className="text-sm font-medium text-slate-600">
                    {he.orders.actions}:
                  </span>

                  <button
                    type="button"
                    disabled={isActionDisabled(order) || loading}
                    onClick={() => handleStatusChange(order.id, "Pending")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
                      order.status === "Pending"
                        ? "bg-amber-600 text-white"
                        : "border border-amber-300 text-amber-800 hover:bg-amber-50"
                    }`}
                  >
                    {he.orders.setPending}
                  </button>

                  <button
                    type="button"
                    disabled={isActionDisabled(order) || loading}
                    onClick={() => handleStatusChange(order.id, "Shipped")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
                      order.status === "Shipped"
                        ? "bg-blue-600 text-white"
                        : "border border-blue-300 text-blue-800 hover:bg-blue-50"
                    }`}
                  >
                    {he.orders.setShipped}
                  </button>

                  <button
                    type="button"
                    disabled={isActionDisabled(order) || loading}
                    onClick={() => handleStatusChange(order.id, "Delivered")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
                      order.status === "Delivered"
                        ? "bg-emerald-600 text-white"
                        : "border border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                    }`}
                  >
                    {he.orders.setDelivered}
                  </button>

                  <button
                    type="button"
                    disabled={isActionDisabled(order) || loading}
                    onClick={() => handleCancel(order.id)}
                    className="me-auto rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? he.orders.cancelling : he.orders.cancel}
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
