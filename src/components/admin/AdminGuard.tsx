import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/modals/AuthModal";
import { dictionaries } from "@/locales/dictionaries";
import { useEffect, useState } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const t = dictionaries.en.authModal;

  useEffect(() => {
    if (!loading && user && isAdmin) {
      setAuthOpen(false);
    }
  }, [loading, user, isAdmin]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-[oklch(0.5_0.08_195)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
          <ShieldAlert className="h-12 w-12 text-[oklch(0.5_0.08_195)]" />
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Admin sign-in required</h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Sign in with your admin Google account to access the Smart bono website dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="rounded-full gradient-burgundy px-6 py-3 text-sm font-semibold text-background"
          >
            {t.googleCta}
          </button>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to website
          </Link>
        </div>
        <AuthModal
          t={t}
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          onComplete={(result) => {
            if (result.isAdmin) navigate({ to: "/admin" });
          }}
        />
      </>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <ShieldAlert className="h-12 w-12 text-destructive" />
        <h1 className="font-display text-2xl font-bold text-ink">Access denied</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Your account does not have admin permissions. Contact a super admin if you need access.
        </p>
        <Link to="/" className="text-sm text-[oklch(0.5_0.08_195)] hover:underline">
          ← Back to website
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
