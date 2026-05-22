import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.jpg";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ADMIN_NAV_SECTIONS } from "@/lib/admin-nav";

type AdminLayoutContextValue = {
  openMobileNav: () => void;
};

const AdminLayoutContext = createContext<AdminLayoutContextValue | null>(null);

export function useAdminLayout() {
  const ctx = useContext(AdminLayoutContext);
  if (!ctx) {
    throw new Error("useAdminLayout must be used within AdminLayout");
  }
  return ctx;
}

function AdminSidebarNav({
  collapsed,
  pathname,
  onNavigate,
}: {
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 overflow-y-auto py-4 px-2">
      {ADMIN_NAV_SECTIONS.map((section) => (
        <div key={section.title} className="mb-6">
          {!collapsed && (
            <div className="px-3 mb-2 text-[10px] font-semibold tracking-widest uppercase text-background/40">
              {section.title}
            </div>
          )}
          {section.items.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href as "/admin"}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-background/15 text-background"
                    : "text-background/60 hover:text-background hover:bg-background/10"
                }`}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" strokeWidth={1.8} />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="bg-[oklch(0.78_0.16_75)] text-ink text-[10px] font-bold rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function AdminSidebarFooter({
  collapsed,
  profile,
  onLogout,
  onToggleCollapse,
  showCollapse,
}: {
  collapsed: boolean;
  profile: ReturnType<typeof useAuth>["profile"];
  onLogout: () => void;
  onToggleCollapse?: () => void;
  showCollapse?: boolean;
}) {
  return (
    <div className="border-t border-background/10 p-3 shrink-0">
      {!collapsed && (
        <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl bg-background/10">
          <div className="h-8 w-8 rounded-full bg-[oklch(0.78_0.16_75)] flex items-center justify-center text-ink font-bold text-sm shrink-0">
            {profile?.displayName?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-background truncate">
              {profile?.displayName || "Admin"}
            </div>
            <div className="text-[10px] text-background/50 uppercase tracking-wide">
              {profile?.role?.replace("_", " ")}
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={onLogout}
        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-background/60 hover:text-background hover:bg-background/10 transition ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <LogOut className="h-4 w-4 shrink-0" />
        {!collapsed && <span>Sign out</span>}
      </button>
      {showCollapse && onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-background/40 hover:text-background/70 hover:bg-background/10 transition mt-1 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      )}
    </div>
  );
}

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { profile, logout } = useAuth();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);
  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);

  return (
    <AdminLayoutContext.Provider value={{ openMobileNav }}>
      <div className="flex h-screen bg-[oklch(0.97_0.01_70)] overflow-hidden">
        {/* Desktop sidebar — in document flow, collapsible */}
        <aside
          className={`hidden md:flex flex-col bg-ink text-background border-r border-background/10 transition-all duration-200 shrink-0 ${
            collapsed ? "w-16" : "w-60"
          }`}
        >
          <div className="flex items-center gap-3 px-4 h-16 border-b border-background/10 shrink-0">
            <img
              src={logo}
              alt="Smart bono"
              className="h-8 w-8 rounded-lg object-contain shrink-0"
            />
            {!collapsed && (
              <span className="font-display text-lg font-bold text-background truncate">
                Smart <span className="text-[oklch(0.78_0.16_75)]">ቦኖ</span>
              </span>
            )}
          </div>

          <AdminSidebarNav collapsed={collapsed} pathname={pathname} />

          <AdminSidebarFooter
            collapsed={collapsed}
            profile={profile}
            onLogout={() => void logout()}
            onToggleCollapse={() => setCollapsed((c) => !c)}
            showCollapse
          />
        </aside>

        {/* Main content — full width on mobile */}
        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile nav — overlays from top, does not push content */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="top"
          className="flex flex-col max-h-[min(90vh,640px)] w-full p-0 gap-0 border-0 bg-ink text-background rounded-b-2xl [&>button]:text-background [&>button]:hover:text-background/80 [&>button]:top-3 [&>button]:right-3"
        >
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>

          <div className="flex items-center gap-3 px-4 h-14 border-b border-background/10 shrink-0 pr-12">
            <img
              src={logo}
              alt="Smart bono"
              className="h-8 w-8 rounded-lg object-contain shrink-0"
            />
            <span className="font-display text-lg font-bold text-background truncate">
              Smart <span className="text-[oklch(0.78_0.16_75)]">ቦኖ</span>
            </span>
          </div>

          <AdminSidebarNav
            collapsed={false}
            pathname={pathname}
            onNavigate={closeMobileNav}
          />

          <AdminSidebarFooter
            collapsed={false}
            profile={profile}
            onLogout={() => {
              closeMobileNav();
              void logout();
            }}
          />
        </SheetContent>
      </Sheet>
    </AdminLayoutContext.Provider>
  );
}

export function AdminTopBar({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  const { openMobileNav } = useAdminLayout();

  return (
    <div className="flex items-center justify-between gap-3 px-4 sm:px-8 py-4 sm:py-5 border-b border-border bg-card">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="md:hidden shrink-0 h-9 w-9"
          onClick={openMobileNav}
          aria-label="Open admin menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-ink truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
