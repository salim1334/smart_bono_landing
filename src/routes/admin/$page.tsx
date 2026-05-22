import { createFileRoute } from "@tanstack/react-router";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminComingSoonPage } from "@/admin/AdminComingSoonPage";
import { getAdminNavItemBySlug } from "@/lib/admin-nav";

export const Route = createFileRoute("/admin/$page")({
  component: AdminComingSoonRoute,
});

function AdminComingSoonRoute() {
  const { page } = Route.useParams();
  const navItem = getAdminNavItemBySlug(page);

  return (
    <AdminGuard>
      <AdminComingSoonPage slug={page} navItem={navItem} />
    </AdminGuard>
  );
}
