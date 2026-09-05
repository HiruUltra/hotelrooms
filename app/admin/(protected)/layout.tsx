import { requireAdmin } from "@/actions/guards";
import { AdminHeader } from "@/components/admin/header";
import { AdminSidebar } from "@/components/admin/sidebar";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="grid min-h-screen bg-muted/40 md:grid-cols-[250px_1fr]">
      <AdminSidebar />
      <div className="min-w-0">
        <AdminHeader />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
