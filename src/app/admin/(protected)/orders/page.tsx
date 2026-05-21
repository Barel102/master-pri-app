import { getOrders } from "@/actions/orders";
import { OrdersTable } from "@/components/admin/orders-table";
import { he } from "@/lib/i18n/admin-he";

export const metadata = {
  title: `${he.orders.title} | ${he.appName}`,
};

export default async function AdminOrdersPage() {
  const result = await getOrders();
  const orders = result.success ? result.data : [];

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{he.orders.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{he.orders.subtitle}</p>
      </header>

      <OrdersTable initialOrders={orders} />
    </div>
  );
}
