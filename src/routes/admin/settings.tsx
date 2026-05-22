import { createFileRoute } from "@tanstack/react-router";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminScheduleSettingsPage } from "@/admin/AdminScheduleSettingsPage";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsRoute,
});

function AdminSettingsRoute() {
  return (
    <AdminGuard>
      <AdminScheduleSettingsPage />
    </AdminGuard>
  );
}
