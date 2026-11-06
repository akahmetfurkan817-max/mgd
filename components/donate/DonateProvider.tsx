"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import DonateModal from "@/components/donate/DonateModal";

interface DonateContextValue {
  openDonate: () => void;
}

const DonateContext = createContext<DonateContextValue | null>(null);

export function DonateProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openDonate = useCallback(() => setOpen(true), []);
  const value = useMemo(() => ({ openDonate }), [openDonate]);
  return (
    <DonateContext.Provider value={value}>
      {children}
      <DonateModal open={open} onClose={() => setOpen(false)} />
    </DonateContext.Provider>
  );
}

export function useDonate(): DonateContextValue {
  const ctx = useContext(DonateContext);
  if (!ctx) throw new Error("useDonate, DonateProvider içinde kullanılmalıdır");
  return ctx;
}
