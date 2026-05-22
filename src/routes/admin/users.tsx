import { createFileRoute } from "@tanstack/react-router";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminUsersPage } from "@/admin/AdminUsersPage";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersRoute,
});

function AdminUsersRoute() {
  return (
    <AdminGuard>
      <AdminUsersPage />
    </AdminGuard>
  );
}
