import { createFileRoute } from "@tanstack/react-router";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminCMSPage } from "@/admin/AdminCMSPage";

export const Route = createFileRoute("/admin/cms")({
  component: AdminCMSRoute,
});

function AdminCMSRoute() {
  return (
    <AdminGuard>
      <AdminCMSPage />
    </AdminGuard>
  );
}
