"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";

interface DonateContextValue {
  openDonate: () => void;
}

const DonateContext = createContext<DonateContextValue | null>(null);

export function DonateProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const openDonate = useCallback(() => {
    router.push("/bagis");
  }, [router]);
  const value = useMemo(() => ({ openDonate }), [openDonate]);
  return <DonateContext.Provider value={value}>{children}</DonateContext.Provider>;
}

export function useDonate(): DonateContextValue {
  const ctx = useContext(DonateContext);
  if (!ctx) throw new Error("useDonate, DonateProvider içinde kullanılmalıdır");
  return ctx;
}
