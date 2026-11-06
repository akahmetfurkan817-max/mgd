"use client";

import { ReactNode } from "react";
import { DonateProvider } from "@/components/donate/DonateProvider";
import { VolunteerProvider } from "@/components/volunteer/VolunteerProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <DonateProvider>
      <VolunteerProvider>{children}</VolunteerProvider>
    </DonateProvider>
  );
}
