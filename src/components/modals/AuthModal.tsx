import { useState } from "react";
import { AnimatePresence } from "motion/react";
import {
  ModalBackdrop,
  ModalPanel,
  ModalScrollBody,
} from "@/components/modals/ModalFrame";
import { X, Loader2, ShieldCheck, Zap, Globe, Check } from "lucide-react";
import { useAuth, type AuthSignInResult } from "@/contexts/AuthContext";
import { isValidPhone } from "@/lib/phone";
import type { dictionaries } from "@/locales/dictionaries";

type AuthModalCopy = (typeof dictionaries)["en"]["authModal"];

type AuthStep = "google" | "phone" | "success";

interface AuthModalProps {
  t: AuthModalCopy;
  isOpen: boolean;
  onClose: () => void;
  /** After sign-in: open onboarding modal or admin — not for generic close */
  onComplete?: (result: AuthSignInResult) => void;
}

export function AuthModal({ t, isOpen, onClose, onComplete }: AuthModalProps) {
  const { signInWithGoogle, savePhone } = useAuth();
  const [step, setStep] = useState<AuthStep>("google");
  const [result, setResult] = useState<AuthSignInResult | null>(null);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const TRUST_BADGES = [
    { icon: ShieldCheck, text: t.trust1 },
    { icon: Zap, text: t.trust2 },
    { icon: Globe, text: t.trust3 },
  ];

  const reset = () => {
    setStep("google");
    setResult(null);
    setPhone("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const finishWithOnboarding = (signInResult: AuthSignInResult) => {
    onComplete?.(signInResult);
    handleClose();
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const signInResult = await signInWithGoogle();
      setResult(signInResult);

      if (signInResult.needsPhone) {
        setStep("phone");
        return;
      }

      if (signInResult.needsOnboarding && !signInResult.isAdmin) {
        finishWithOnboarding(signInResult);
        return;
      }

      setStep("success");
    } catch (err: unknown) {
      setError(
        err instanceof Error && err.message.includes("not configured")
          ? t.errorFirebase
          : t.errorGeneric,
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!isValidPhone(phone)) {
      setError(t.phoneError);
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await savePhone(phone);
      const next = result ? { ...result, needsPhone: false } : null;
      if (next) setResult(next);

      if (next?.needsOnboarding && !next.isAdmin) {
        finishWithOnboarding(next);
        return;
      }

      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.errorGeneric);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessContinue = () => {
    if (!result) {
      handleClose();
      return;
    }
    if (result.isAdmin) {
      onComplete?.(result);
    }
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalBackdrop onClose={handleClose}>
          <ModalPanel maxWidth="max-w-md">
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <ModalScrollBody className="px-8 pt-8 pb-10">
              {step === "google" && (
                <>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-1.5 text-xl font-display font-bold mb-4">
                      Smart <span className="text-[oklch(0.5_0.08_195)]">ቦኖ</span>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-ink leading-tight">
                      {t.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition shadow-soft disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {t.signingIn}
                      </>
                    ) : (
                      <>
                        <GoogleIcon />
                        {t.googleCta}
                      </>
                    )}
                  </button>

                  {error && (
                    <p className="mt-3 text-center text-xs text-destructive">{error}</p>
                  )}

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs text-muted-foreground">
                      <span className="bg-card px-3">{t.divider}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-6">
                    {TRUST_BADGES.map((badge) => (
                      <div
                        key={badge.text}
                        className="flex items-center gap-3 text-sm text-muted-foreground"
                      >
                        <div className="h-6 w-6 rounded-full gradient-teal flex items-center justify-center shrink-0">
                          <badge.icon className="h-3 w-3 text-background" />
                        </div>
                        {badge.text}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {step === "phone" && (
                <div className="text-center">
                  <h2 className="font-display text-2xl font-bold text-ink">{t.phoneTitle}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{t.phoneDesc}</p>
                  <div className="mt-8 text-left">
                    <label className="block text-xs font-semibold mb-1.5">
                      {t.phoneLabel} *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
                    />
                  </div>
                  {error && (
                    <p className="mt-3 text-center text-xs text-destructive">{error}</p>
                  )}
                  <button
                    type="button"
                    onClick={handlePhoneSubmit}
                    disabled={isSubmitting}
                    className="mt-6 w-full rounded-xl gradient-burgundy text-background px-6 py-3 text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.signingIn}
                      </>
                    ) : (
                      t.phoneContinue
                    )}
                  </button>
                </div>
              )}

              {step === "success" && (
                <div className="text-center py-4">
                  <div className="mx-auto h-16 w-16 rounded-full gradient-teal flex items-center justify-center mb-6">
                    <Check className="h-8 w-8 text-background" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-ink">
                    {result?.isNewUser ? t.welcomeNew : t.welcomeBack}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground">{t.signedInDesc}</p>
                  <button
                    type="button"
                    onClick={handleSuccessContinue}
                    className="mt-8 w-full rounded-xl gradient-burgundy text-background px-6 py-3 text-sm font-semibold hover:opacity-95 transition"
                  >
                    {t.continueBtn}
                  </button>
                </div>
              )}
            </ModalScrollBody>
          </ModalPanel>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
