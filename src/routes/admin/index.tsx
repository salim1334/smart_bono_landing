import { createFileRoute } from "@tanstack/react-router";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminDashboardPage } from "@/admin/AdminDashboardPage";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
});

function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboardPage />
    </AdminGuard>
  );
}
