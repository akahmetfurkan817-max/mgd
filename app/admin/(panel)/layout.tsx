import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireUser } from "@/lib/session";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="flex min-h-screen flex-col bg-surface md:flex-row">
      <AdminSidebar user={user} />
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1400px]">{children}</main>
    </div>
  );
}
