"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { logoutAdmin } from "@/actions/admin-auth";
import { he } from "@/lib/i18n/admin-he";

const navItems = [
  { href: "/admin/products", label: he.nav.products },
  { href: "/admin/categories", label: he.nav.categories },
  { href: "/admin/orders", label: he.nav.orders },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => {
      logoutAdmin();
    });
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-s border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <h1 className="text-lg font-bold text-slate-900">{he.appName}</h1>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
        >
          {he.nav.logout}
        </button>
      </div>
    </aside>
  );
}
