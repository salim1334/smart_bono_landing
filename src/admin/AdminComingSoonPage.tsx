import { Link } from "@tanstack/react-router";
import { ArrowLeft, Construction } from "lucide-react";
import { AdminLayout, AdminTopBar } from "@/admin/AdminLayout";
import type { AdminNavItem } from "@/lib/admin-nav";
import { formatAdminSlugTitle } from "@/lib/admin-nav";

interface AdminComingSoonPageProps {
  navItem?: AdminNavItem;
  slug: string;
}

export function AdminComingSoonPage({ navItem, slug }: AdminComingSoonPageProps) {
  const title = navItem?.label ?? formatAdminSlugTitle(slug);
  const Icon = navItem?.icon ?? Construction;

  return (
    <AdminLayout>
      <AdminTopBar title={title} subtitle="This section is not available yet" />
      <div className="flex flex-col items-center justify-center px-6 py-20 sm:py-28 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[oklch(0.78_0.16_75)]/25 text-ink mb-6">
          <Icon className="h-8 w-8" strokeWidth={1.6} />
        </div>
        <p className="text-xs font-semibold tracking-widest uppercase text-[oklch(0.5_0.08_195)]">
          Coming soon
        </p>
        <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-ink max-w-md">
          {title} is on the way
        </h2>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground leading-relaxed">
          We&apos;re still building this part of the admin panel for the Smart bono
          MVP. Check back after the next release, or use the dashboard and other
          ready tools in the meantime.
        </p>
        <Link
          to="/admin"
          className="mt-8 inline-flex items-center gap-2 rounded-full gradient-burgundy px-5 py-2.5 text-sm font-semibold text-background hover:opacity-95 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>
    </AdminLayout>
  );
}
