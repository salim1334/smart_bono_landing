import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Bell,
  Settings,
  Newspaper,
  MessageSquare,
  Star,
  Shield,
  Activity,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export interface AdminNavSection {
  title: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Leads", href: "/admin/leads", icon: Users },
      { label: "Appointments", href: "/admin/appointments", icon: Calendar },
      { label: "Contact Forms", href: "/admin/contacts", icon: MessageSquare },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "CMS", href: "/admin/cms", icon: FileText },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
      { label: "Blog", href: "/admin/blog", icon: Newspaper },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
      { label: "Users", href: "/admin/users", icon: Shield },
      { label: "Activity Log", href: "/admin/activity", icon: Activity },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

/** Admin paths that have a dedicated page implementation. */
export const ADMIN_BUILT_SLUGS = new Set([
  "leads",
  "appointments",
  "cms",
  "settings",
  "users",
]);

export function adminHrefToSlug(href: string): string {
  return href === "/admin" ? "" : href.replace(/^\/admin\/?/, "");
}

export function getAdminNavItemBySlug(slug: string): AdminNavItem | undefined {
  for (const section of ADMIN_NAV_SECTIONS) {
    for (const item of section.items) {
      if (adminHrefToSlug(item.href) === slug) return item;
    }
  }
  return undefined;
}

export function formatAdminSlugTitle(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
