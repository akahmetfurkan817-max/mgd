"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import VolunteerModal from "@/components/volunteer/VolunteerModal";

interface VolunteerContextValue {
  openVolunteer: () => void;
}

const VolunteerContext = createContext<VolunteerContextValue | null>(null);

export function VolunteerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openVolunteer = useCallback(() => setOpen(true), []);
  const value = useMemo(() => ({ openVolunteer }), [openVolunteer]);

  return (
    <VolunteerContext.Provider value={value}>
      {children}
      <VolunteerModal open={open} onClose={() => setOpen(false)} />
    </VolunteerContext.Provider>
  );
}

export function useVolunteer(): VolunteerContextValue {
  const ctx = useContext(VolunteerContext);
  if (!ctx) {
    throw new Error("useVolunteer, VolunteerProvider içinde kullanılmalıdır");
  }
  return ctx;
}
