"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { StoreCategory } from "@/actions/store";
import { storeHe } from "@/lib/i18n/store-he";

export type ProductFilter = "all" | number;

export type StoreFilterTab = {
  id: ProductFilter;
  label: string;
};

type StoreUIContextValue = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: ProductFilter;
  setActiveFilter: (filter: ProductFilter) => void;
  filterTabs: StoreFilterTab[];
};

const StoreUIContext = createContext<StoreUIContextValue | null>(null);

type StoreUIProviderProps = {
  children: ReactNode;
  categories: StoreCategory[];
};

export function StoreUIProvider({ children, categories }: StoreUIProviderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ProductFilter>("all");

  const filterTabs = useMemo<StoreFilterTab[]>(
    () => [
      { id: "all", label: storeHe.filter.all },
      ...categories.map((category) => ({
        id: category.id as ProductFilter,
        label: category.name,
      })),
    ],
    [categories],
  );

  return (
    <StoreUIContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        filterTabs,
      }}
    >
      {children}
    </StoreUIContext.Provider>
  );
}

export function useStoreUI() {
  const context = useContext(StoreUIContext);
  if (!context) {
    throw new Error("useStoreUI must be used within StoreUIProvider");
  }
  return context;
}
