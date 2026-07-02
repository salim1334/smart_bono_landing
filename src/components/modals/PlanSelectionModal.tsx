import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Check,
  Package,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { isFirebaseConfigured, leadService } from "@/lib/firestore";
import { calculatePlanQuote } from "@/lib/pricing";
import { isValidPhone, isValidPhoneInput, normalizePhone } from "@/lib/phone";
import { cn } from "@/lib/utils";
import {
  ModalBackdrop,
  ModalFooter,
  ModalPanel,
  ModalScrollBody,
} from "@/components/modals/ModalFrame";
import type { dictionaries } from "@/locales/dictionaries";
import { getTierDisplayName } from "@/lib/cms-defaults";
import type { BillingTerm, PlanTier, PricingTierUI } from "@/lib/types";

type PlanSelectionCopy = (typeof dictionaries)["en"]["planSelection"];

export interface PlanSelection {
  tier: PlanTier;
  term: BillingTerm;
}

interface PlanSelectionModalProps {
  t: PlanSelectionCopy;
  isOpen: boolean;
  onClose: () => void;
  selection: PlanSelection | null;
  pricingTiers?: PricingTierUI[];
}

interface ContactForm {
  name: string;
  phone: string;
  email: string;
  businessName: string;
  city: string;
}

function mapFirebaseError(err: unknown, t: PlanSelectionCopy): string {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code: string }).code)
      : "";
  if (code === "permission-denied") return t.errorPermission;
  if (err instanceof Error && err.message.includes("not configured")) {
    return t.errorFirebase;
  }
  return err instanceof Error ? err.message : t.errorSubmit;
}

export function PlanSelectionModal({
  t,
  isOpen,
  onClose,
  selection,
  pricingTiers = [],
}: PlanSelectionModalProps) {
  const { user, profile } = useAuth();
  const STEPS = t.steps;
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState<ContactForm>({
    name: "",
    phone: "",
    email: "",
    businessName: "",
    city: "",
  });

  const update = (key: keyof ContactForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setSubmitted(false);
      setSubmitError("");
      return;
    }
    if (user && profile) {
      setForm((f) => ({
        ...f,
        name: profile.displayName || f.name,
        email: profile.email || f.email,
        phone: profile.phone || f.phone,
      }));
    }
  }, [isOpen, user, profile]);

  if (!isOpen || !selection) return null;

  const { tier, term } = selection;
  const tierMeta = pricingTiers.find((x) => x.tierId === tier);
  const quote = calculatePlanQuote(tier, term, tierMeta?.baseEtb, tierMeta?.pricesEtb);
  const tierName =
    pricingTiers.length > 0
      ? getTierDisplayName(pricingTiers, tier)
      : t.tierNames[tier];
  const termLabel = t.months[String(term) as "3" | "6" | "12"];
  const isHybrid = quote.monthlyEtb === null;

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1)
      return form.name.trim().length >= 2 && isValidPhoneInput(form.phone);
    return true;
  };

  const handleSubmit = async () => {
    if (!isFirebaseConfigured) {
      setSubmitError(t.errorFirebase);
      return;
    }
    const phone = normalizePhone(form.phone);
    if (!isValidPhone(phone)) {
      setSubmitError(t.errorRequired);
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await leadService.create({
        name: form.name.trim(),
        phone,
        email: form.email.trim() || undefined,
        businessName: form.businessName.trim() || undefined,
        city: form.city.trim() || undefined,
        source: "pricing_selection",
        status: "interested",
        tags: [
          `plan_${tier}`,
          ...(isHybrid ? [] : [`term_${term}m`]),
        ],
        interestedTier: tier,
        billingTermMonths: isHybrid ? undefined : term,
        quotedMonthlyEtb: quote.monthlyEtb ?? undefined,
        quotedTotalEtb: quote.totalEtb ?? undefined,
        userId: user?.uid,
      });
      setSubmitted(true);
      setStep(2);
    } catch (err) {
      console.error(err);
      setSubmitError(mapFirebaseError(err, t));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  return (
    <ModalBackdrop onClose={handleClose}>
      <ModalPanel>
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <ModalScrollBody className="px-8 pt-10 pb-10 text-center">
            <div className="mx-auto h-16 w-16 rounded-full gradient-teal flex items-center justify-center mb-5">
              <Check className="h-8 w-8 text-background" />
            </div>
            <h2 className="font-display text-2xl font-bold text-ink">
              {t.successTitle}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {t.successBody}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-8 w-full rounded-xl gradient-burgundy text-background px-4 py-3 text-sm font-semibold hover:opacity-95 transition"
            >
              {t.done}
            </button>
          </ModalScrollBody>
        ) : (
          <>
          <ModalScrollBody className="px-8 pt-8 pb-4">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-ink">
                {t.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
            </div>

            <div className="flex items-center gap-1 mb-8">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className="flex items-center gap-1 flex-1 last:flex-none"
                >
                  <div
                    className={`h-2 rounded-full transition-all ${
                      i < step
                        ? "bg-[oklch(0.5_0.08_195)] flex-1"
                        : i === step
                          ? "gradient-burgundy flex-1"
                          : "bg-border flex-1"
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="text-xs text-muted-foreground mb-6 font-medium uppercase tracking-widest">
              {t.stepOf} {step + 1} {t.of} {STEPS.length} — {STEPS[step]}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 0 && (
                  <div className="rounded-2xl border border-border bg-muted/30 p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl gradient-burgundy flex items-center justify-center">
                        <Package className="h-5 w-5 text-background" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">
                          {t.planLabel}
                        </div>
                        <div className="font-display text-xl font-bold text-ink">
                          {tierName}
                        </div>
                      </div>
                    </div>
                    {!isHybrid && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {t.termLabel}
                          </span>
                          <span className="font-semibold">{termLabel}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {t.monthlyLabel}
                          </span>
                          <span className="font-semibold">
                            {quote.monthlyEtb?.toLocaleString()} ETB
                          </span>
                        </div>
                        <div className="flex justify-between text-sm border-t border-border pt-3">
                          <span className="text-muted-foreground">
                            {t.totalLabel}
                          </span>
                          <span className="font-bold text-ink">
                            {quote.totalEtb?.toLocaleString()} ETB
                          </span>
                        </div>
                      </>
                    )}
                    {isHybrid && (
                      <div className="text-sm">
                        <p className="font-semibold text-ink">{t.customPlan}</p>
                        <p className="text-muted-foreground mt-1">
                          {t.talkSales}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {t.fullName} *
                      </label>
                      <input
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        onInput={(e) => update("name", e.currentTarget.value)}
                        autoComplete="name"
                        placeholder={t.namePlaceholder}
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.5_0.08_195)]/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {t.phone} *
                      </label>
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        onInput={(e) => update("phone", e.currentTarget.value)}
                        placeholder={t.phonePlaceholder}
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.5_0.08_195)]/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {t.emailOptional}
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder={t.emailPlaceholder}
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.5_0.08_195)]/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {t.businessName}
                      </label>
                      <input
                        value={form.businessName}
                        onChange={(e) => update("businessName", e.target.value)}
                        placeholder={t.businessPlaceholder}
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.5_0.08_195)]/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {t.city}
                      </label>
                      <input
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        placeholder={t.cityPlaceholder}
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.5_0.08_195)]/30"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {submitError && (
              <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {submitError}
              </p>
            )}
          </ModalScrollBody>

          <ModalFooter>
            <div className="flex gap-3">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold hover:bg-muted transition"
                >
                  <ChevronLeft className="h-4 w-4" /> {t.back}
                </button>
              )}
              {step < 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (canProceed()) setStep((s) => s + 1);
                  }}
                  aria-disabled={!canProceed()}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 rounded-xl gradient-burgundy text-background px-4 py-3 text-sm font-semibold hover:opacity-95 transition",
                    !canProceed() && "opacity-40 pointer-events-none",
                  )}
                >
                  {t.continue} <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  aria-disabled={!canProceed()}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 rounded-xl gradient-burgundy text-background px-4 py-3 text-sm font-semibold hover:opacity-95 transition",
                    (isSubmitting || !canProceed()) &&
                      "opacity-60 pointer-events-none",
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />{" "}
                      {t.submitting}
                    </>
                  ) : (
                    t.submit
                  )}
                </button>
              )}
            </div>
          </ModalFooter>
          </>
        )}
      </ModalPanel>
    </ModalBackdrop>
  );
}
