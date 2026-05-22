import type { UserProfile, UserRole } from "@/lib/types";

export function canManageUserRole(
  actor: Pick<UserProfile, "uid" | "role">,
  target: Pick<UserProfile, "uid" | "role">,
  nextRole: UserRole,
): { allowed: boolean; reason?: string } {
  if (actor.uid === target.uid) {
    return { allowed: false, reason: "You cannot change your own role." };
  }

  if (target.role === "super_admin" && actor.role !== "super_admin") {
    return {
      allowed: false,
      reason: "Only a super admin can change another super admin.",
    };
  }

  if (nextRole === "super_admin" && actor.role !== "super_admin") {
    return {
      allowed: false,
      reason: "Only a super admin can grant super admin access.",
    };
  }

  if (actor.role === "admin" && nextRole === "super_admin") {
    return {
      allowed: false,
      reason: "Only a super admin can grant super admin access.",
    };
  }

  return { allowed: true };
}

export const ROLE_LABELS: Record<UserRole, string> = {
  user: "User",
  admin: "Admin",
  super_admin: "Super admin",
};
