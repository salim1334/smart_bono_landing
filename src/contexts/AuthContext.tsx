import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getAdditionalUserInfo,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from "firebase/auth";
import {
  getClientAuth,
  getGoogleProvider,
  isFirebaseConfigured,
} from "@/firebase";
import { userService } from "@/lib/firestore";
import { normalizePhone } from "@/lib/phone";
import type { UserProfile, UserRole } from "@/lib/types";

const SUPER_ADMIN_EMAIL = "salimahmed110077@gmail.com";

function prefersRedirectSignIn(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 767px)").matches ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  );
}

export interface AuthSignInResult {
  isNewUser: boolean;
  needsPhone: boolean;
  needsOnboarding: boolean;
  isAdmin: boolean;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  firebaseReady: boolean;
  signInWithGoogle: () => Promise<AuthSignInResult>;
  logout: () => Promise<void>;
  savePhone: (phone: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function resolveRole(
  email: string | null | undefined,
  existing?: UserRole,
): UserRole {
  if (email?.toLowerCase() === SUPER_ADMIN_EMAIL) return "super_admin";
  return existing ?? "user";
}

async function ensureUserProfile(firebaseUser: User): Promise<UserProfile | null> {
  const existing = await userService.get(firebaseUser.uid);
  const role = resolveRole(firebaseUser.email, existing?.role);

  if (!existing) {
    await userService.create(firebaseUser.uid, {
      email: firebaseUser.email ?? "",
      displayName: firebaseUser.displayName ?? "",
      photoURL: firebaseUser.photoURL ?? undefined,
      role,
    });
  } else if (role !== existing.role) {
    await userService.update(firebaseUser.uid, { role });
  }

  return userService.get(firebaseUser.uid);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    const doc = await userService.get(user.uid);
    setProfile(doc);
  }, [user]);

  useEffect(() => {
    const auth = getClientAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    let unsubscribeProfile: (() => void) | undefined;

    let unsubscribeAuth: (() => void) | undefined;

    void getRedirectResult(auth)
      .catch((err) => {
        console.error("Google redirect sign-in failed:", err);
      })
      .finally(() => {
        unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
          setUser(firebaseUser);

          if (unsubscribeProfile) {
            unsubscribeProfile();
            unsubscribeProfile = undefined;
          }

          if (!firebaseUser) {
            setProfile(null);
            setLoading(false);
            return;
          }

          try {
            await ensureUserProfile(firebaseUser);
            unsubscribeProfile = userService.subscribeToProfile(
              firebaseUser.uid,
              setProfile,
            );
          } catch (err) {
            console.error("Failed to load user profile:", err);
          } finally {
            setLoading(false);
          }
        });
      });

    return () => {
      unsubscribeAuth?.();
      unsubscribeProfile?.();
    };
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<AuthSignInResult> => {
    const auth = getClientAuth();
    if (!auth) {
      throw new Error(
        "Firebase is not configured. Add your keys to .env first.",
      );
    }

    const provider = getGoogleProvider();

    if (prefersRedirectSignIn()) {
      await signInWithRedirect(auth, provider);
      return {
        isNewUser: false,
        needsPhone: false,
        needsOnboarding: false,
        isAdmin: false,
      };
    }

    const credential = await signInWithPopup(auth, getGoogleProvider());
    const additional = getAdditionalUserInfo(credential);
    const profileDoc = await ensureUserProfile(credential.user);

    const isNewUser = additional?.isNewUser ?? false;
    const needsPhone = !profileDoc?.phone;
    const needsOnboarding = !profileDoc?.onboardingCompleted;
    const isAdmin =
      profileDoc?.role === "admin" || profileDoc?.role === "super_admin";

    return { isNewUser, needsPhone, needsOnboarding, isAdmin };
  }, []);

  const logout = useCallback(async () => {
    const auth = getClientAuth();
    if (auth) await signOut(auth);
    setProfile(null);
    setUser(null);
  }, []);

  const savePhone = useCallback(
    async (phone: string) => {
      const auth = getClientAuth();
      const uid = auth?.currentUser?.uid ?? user?.uid;
      if (!uid) throw new Error("Not signed in");
      await userService.update(uid, { phone: normalizePhone(phone) });
      const updated = await userService.get(uid);
      if (updated) setProfile(updated);
    },
    [user],
  );

  const isSuperAdmin = profile?.role === "super_admin";
  const isAdmin = isSuperAdmin || profile?.role === "admin";

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAdmin,
      isSuperAdmin,
      firebaseReady: isFirebaseConfigured,
      signInWithGoogle,
      logout,
      savePhone,
      refreshProfile,
    }),
    [
      user,
      profile,
      loading,
      isAdmin,
      isSuperAdmin,
      signInWithGoogle,
      logout,
      savePhone,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
