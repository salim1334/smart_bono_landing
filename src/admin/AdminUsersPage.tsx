import { useEffect, useMemo, useState } from "react";
import {
  Shield,
  ShieldPlus,
  Loader2,
  Mail,
  UserCircle2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { AdminLayout, AdminTopBar } from "@/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/lib/firestore";
import { canManageUserRole, ROLE_LABELS } from "@/lib/admin-roles";
import type { UserProfile, UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ROLE_STYLES: Record<UserRole, string> = {
  user: "bg-muted text-muted-foreground",
  admin: "bg-[oklch(0.5_0.08_195)]/15 text-[oklch(0.3_0.08_195)]",
  super_admin: "bg-[oklch(0.78_0.16_75)]/25 text-ink",
};

function formatJoined(profile: UserProfile): string {
  const ts = profile.createdAt;
  if (!ts?.toDate) return "—";
  return ts.toDate().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AdminUsersPage() {
  const { user, profile, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [banner, setBanner] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const unsub = userService.subscribeToAll((list) => {
      setUsers(list);
      setLoading(false);
    });
    return unsub;
  }, []);

  const admins = useMemo(
    () => users.filter((u) => u.role === "admin" || u.role === "super_admin"),
    [users],
  );

  const grantAdminByEmail = async () => {
    const email = inviteEmail.trim();
    if (!email || !user || !profile) return;

    setBusy("invite");
    setBanner(null);
    try {
      const target = await userService.findByEmail(email);
      if (!target) {
        setBanner({
          type: "error",
          message:
            "No account found for this email. Ask them to sign in once on the website with Google, then try again.",
        });
        return;
      }

      const check = canManageUserRole(profile, target, "admin");
      if (!check.allowed) {
        setBanner({ type: "error", message: check.reason ?? "Not allowed." });
        return;
      }

      if (target.role === "admin" || target.role === "super_admin") {
        setBanner({
          type: "success",
          message: `${target.displayName || email} already has admin access.`,
        });
        setInviteEmail("");
        return;
      }

      await userService.updateRole(target.uid, "admin", {
        uid: user.uid,
        email: user.email ?? profile.email,
      });
      setBanner({
        type: "success",
        message: `${target.displayName || email} can now access the admin panel.`,
      });
      setInviteEmail("");
    } catch (err) {
      console.error(err);
      setBanner({
        type: "error",
        message: "Could not grant admin access. Check Firestore rules and try again.",
      });
    } finally {
      setBusy(null);
    }
  };

  const changeRole = async (target: UserProfile, nextRole: UserRole) => {
    if (!user || !profile || target.role === nextRole) return;

    const check = canManageUserRole(profile, target, nextRole);
    if (!check.allowed) {
      setBanner({ type: "error", message: check.reason ?? "Not allowed." });
      return;
    }

    setBusy(target.uid);
    setBanner(null);
    try {
      await userService.updateRole(target.uid, nextRole, {
        uid: user.uid,
        email: user.email ?? profile.email,
      });
      setBanner({
        type: "success",
        message: `Updated ${target.displayName || target.email} to ${ROLE_LABELS[nextRole]}.`,
      });
    } catch (err) {
      console.error(err);
      setBanner({
        type: "error",
        message: "Could not update role. You may not have permission for this change.",
      });
    } finally {
      setBusy(null);
    }
  };

  const roleOptions = (target: UserProfile): UserRole[] => {
    if (isSuperAdmin) return ["user", "admin", "super_admin"];
    if (target.role === "super_admin") return [target.role];
    return ["user", "admin"];
  };

  return (
    <AdminLayout>
      <AdminTopBar
        title="Users & admins"
        subtitle="Grant admin access to teammates who have signed in with Google"
      />

      <div className="px-4 sm:px-8 py-6 sm:py-8 space-y-6 max-w-5xl">
        {banner && (
          <div
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
              banner.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {banner.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            )}
            <p>{banner.message}</p>
          </div>
        )}

        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <ShieldPlus className="h-5 w-5 text-[oklch(0.5_0.08_195)]" />
            <h2 className="font-display text-lg font-bold text-ink">
              Add an admin
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            The person must sign in on the public site with Google at least once
            so their profile exists. Then enter their Google email below.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="name@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="pl-9"
                onKeyDown={(e) => {
                  if (e.key === "Enter") void grantAdminByEmail();
                }}
              />
            </div>
            <Button
              type="button"
              disabled={!inviteEmail.trim() || busy === "invite"}
              onClick={() => void grantAdminByEmail()}
              className="gradient-burgundy text-background hover:opacity-95 shrink-0"
            >
              {busy === "invite" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Grant admin access"
              )}
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                All accounts
              </h2>
              <p className="text-sm text-muted-foreground">
                {admins.length} admin{admins.length === 1 ? "" : "s"} ·{" "}
                {users.length} total
              </p>
            </div>
            <Shield className="h-5 w-5 text-muted-foreground shrink-0" />
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-muted-foreground">
              No user profiles yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-muted-foreground">
                    <th className="px-5 py-3 font-medium">User</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                    <th className="px-5 py-3 font-medium hidden sm:table-cell">
                      Joined
                    </th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const isSelf = u.uid === profile?.uid;
                    const options = roleOptions(u);
                    const canEdit =
                      !isSelf &&
                      options.length > 1 &&
                      (u.role !== "super_admin" || isSuperAdmin);

                    return (
                      <tr
                        key={u.uid}
                        className="border-b border-border/60 last:border-0"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            {u.photoURL ? (
                              <img
                                src={u.photoURL}
                                alt=""
                                className="h-9 w-9 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <UserCircle2 className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-ink truncate">
                                {u.displayName || "—"}
                                {isSelf && (
                                  <span className="text-muted-foreground font-normal">
                                    {" "}
                                    (you)
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${ROLE_STYLES[u.role]}`}
                          >
                            {ROLE_LABELS[u.role]}
                          </span>
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell text-muted-foreground">
                          {formatJoined(u)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {canEdit ? (
                            <select
                              value={u.role}
                              disabled={busy === u.uid}
                              onChange={(e) =>
                                void changeRole(u, e.target.value as UserRole)
                              }
                              className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm min-w-[120px]"
                            >
                              {options.map((r) => (
                                <option key={r} value={r}>
                                  {ROLE_LABELS[r]}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {isSelf ? "—" : "Protected"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
