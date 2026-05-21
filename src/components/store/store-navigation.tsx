"use client";

import Link from "next/link";
import { useStoreUI } from "@/components/store/store-ui-context";
import { storeHe } from "@/lib/i18n/store-he";

export function StoreNavigation() {
  const { searchQuery, setSearchQuery, activeFilter, setActiveFilter, filterTabs } =
    useStoreUI();

  return (
    <div className="sticky top-0 z-40 bg-white">
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 lg:max-w-none lg:px-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <Link href="/" className="shrink-0">
              <span className="text-xl font-bold text-[#007934] sm:text-2xl">
                {storeHe.appName}
              </span>
            </Link>
            <p className="hidden text-xs text-gray-500 sm:block">
              {storeHe.hero.badge}
            </p>
          </div>

          <div className="relative mx-auto max-w-2xl pb-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 start-4 size-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={storeHe.search.placeholder}
              className="w-full rounded-full border-0 bg-gray-100 py-3.5 pe-4 ps-12 text-base text-gray-900 outline-none ring-[#007934] transition-shadow placeholder:text-gray-500 focus:bg-white focus:ring-2"
              aria-label={storeHe.search.label}
            />
          </div>
        </div>
      </header>

      <nav className="border-b border-gray-200" aria-label="קטגוריות מוצרים">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:max-w-none lg:px-6">
          <div className="flex gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filterTabs.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={String(filter.id)}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`relative shrink-0 px-5 py-3.5 text-sm font-semibold transition-colors sm:px-6 sm:text-base ${
                    isActive
                      ? "font-bold text-[#007934]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {filter.label}
                  {isActive && (
                    <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#007934]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
