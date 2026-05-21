"use client";

import { useEffect, useState } from "react";
import { CartPanel } from "@/components/store/cart-panel";

export function CartDesktopSidebar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <aside className="fixed bottom-0 left-0 top-28 z-30 hidden w-80 border-e border-gray-200 bg-white lg:block" />
    );
  }

  return (
    <aside className="fixed bottom-0 left-0 top-28 z-30 hidden w-80 border-e border-gray-200 bg-white lg:block">
      <CartPanel variant="sidebar" />
    </aside>
  );
}
