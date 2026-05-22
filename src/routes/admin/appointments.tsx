import { createFileRoute } from "@tanstack/react-router";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminAppointmentsPage } from "@/admin/AdminAppointmentsPage";

export const Route = createFileRoute("/admin/appointments")({
  component: AdminAppointmentsRoute,
  validateSearch: (search: Record<string, unknown>) => ({
    status: typeof search.status === "string" ? search.status : undefined,
  }),
});

function AdminAppointmentsRoute() {
  return (
    <AdminGuard>
      <AdminAppointmentsPage />
    </AdminGuard>
  );
}
