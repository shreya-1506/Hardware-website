import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { dashboardStats } from "@/lib/queries";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already blocks unauthenticated requests; this is the
  // server-side belt-and-braces check that also gives us the session.
  const session = await requireAdmin();
  const stats = dashboardStats();

  return (
    <AdminShell
      user={{ name: session.name, email: session.email }}
      newEnquiries={stats.newEnquiries}
    >
      {children}
    </AdminShell>
  );
}
