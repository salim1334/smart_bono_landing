import { useState } from "react";
import { ArrowRight, LogOut, Menu } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.jpg";
import { Language } from "@/locales/dictionaries";
import { useAuth } from "@/contexts/AuthContext";
import type { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavCopy = {
  smartPrinting: string;
  hybrid: string;
  pricing: string;
  trust: string;
  bookDemo: string;
  signIn: string;
  signOut: string;
  account: string;
  menu: string;
  admin: string;
  logoutTitle: string;
  logoutDesc: string;
  logoutConfirm: string;
  logoutCancel: string;
  signingOut: string;
};

const NAV_LINKS = [
  { href: "#printing", key: "smartPrinting" as const },
  { href: "#hybrid", key: "hybrid" as const },
  { href: "#pricing", key: "pricing" as const },
  { href: "#trust", key: "trust" as const },
];

function ProfileAvatar({ profile }: { profile: UserProfile | null }) {
  if (profile?.photoURL) {
    return (
      <img
        src={profile.photoURL}
        alt=""
        className="h-8 w-8 rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <div className="h-8 w-8 rounded-full gradient-teal flex items-center justify-center text-background text-xs font-bold shrink-0">
      {profile?.displayName?.[0]?.toUpperCase() || "U"}
    </div>
  );
}

export function NavBar({
  lang,
  setLang,
  t,
  onBookDemo,
  onSignIn,
}: {
  lang: Language;
  setLang: (l: Language) => void;
  t: NavCopy;
  onBookDemo: () => void;
  onSignIn: () => void;
}) {
  const { user, profile, logout, isAdmin, loading } = useAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const displayName = profile?.displayName?.split(" ")[0] || t.account;

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await logout();
      setLogoutOpen(false);
    } finally {
      setSigningOut(false);
    }
  };

  const requestLogout = () => setLogoutOpen(true);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src={logo} alt="Smart bono" className="h-9 w-9 object-contain" />
            <span className="font-display text-xl font-bold tracking-tight">
              Smart <span className="text-[oklch(0.5_0.08_195)]">ቦኖ</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-foreground transition"
              >
                {t[link.key]}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "am" : "en")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition px-1"
            >
              {lang === "en" ? "አማ" : "EN"}
            </button>

            {!loading && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden h-9 w-9 shrink-0"
                    aria-label={t.menu}
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {user ? (
                    <>
                      <DropdownMenuLabel className="font-normal p-0">
                        <div className="flex items-center gap-2.5 px-2 py-2">
                          <ProfileAvatar profile={profile} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">
                              {profile?.displayName || t.account}
                            </p>
                            {profile?.email && (
                              <p className="text-xs text-muted-foreground truncate">
                                {profile.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin">{t.admin}</Link>
                        </DropdownMenuItem>
                      )}
                    </>
                  ) : null}

                  {NAV_LINKS.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <a href={link.href}>{t[link.key]}</a>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />

                  {user ? (
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        requestLogout();
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      {t.signOut}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        onSignIn();
                      }}
                    >
                      {t.signIn}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {!loading && user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden md:inline text-sm font-medium text-[oklch(0.5_0.08_195)] hover:underline"
                  >
                    {t.admin}
                  </Link>
                )}
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground max-w-[140px]">
                  <ProfileAvatar profile={profile} />
                  <span className="truncate font-medium text-foreground">
                    {displayName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={requestLogout}
                  className="hidden md:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  title={t.signOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t.signOut}</span>
                </button>
              </>
            ) : (
              !loading && (
                <button
                  type="button"
                  onClick={onSignIn}
                  className="hidden md:inline text-sm font-medium text-muted-foreground hover:text-foreground transition"
                >
                  {t.signIn}
                </button>
              )
            )}

            <button
              type="button"
              onClick={onBookDemo}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-ink text-background px-3 sm:px-4 py-2 text-sm font-medium hover:opacity-90 transition shrink-0"
            >
              <span className="max-[360px]:hidden">{t.bookDemo}</span>
              <span className="hidden max-[360px]:inline">Demo</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.logoutTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.logoutDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={signingOut}>
              {t.logoutCancel}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={signingOut}
              onClick={() => void handleLogout()}
            >
              {signingOut ? t.signingOut : t.logoutConfirm}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
