import { createFileRoute } from "@tanstack/react-router";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLeadsPage } from "@/admin/AdminLeadsPage";

export const Route = createFileRoute("/admin/leads")({
  component: AdminLeadsRoute,
  validateSearch: (search: Record<string, unknown>) => ({
    status: typeof search.status === "string" ? search.status : undefined,
    source: typeof search.source === "string" ? search.source : undefined,
    tier: typeof search.tier === "string" ? search.tier : undefined,
  }),
});

function AdminLeadsRoute() {
  return (
    <AdminGuard>
      <AdminLeadsPage />
    </AdminGuard>
  );
}
