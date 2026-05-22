import { useState } from "react";
import { AnimatePresence } from "motion/react";
import {
  ModalBackdrop,
  ModalPanel,
  ModalScrollBody,
} from "@/components/modals/ModalFrame";
import { X, Loader2, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { companyService, userService } from "@/lib/firestore";
import type { dictionaries } from "@/locales/dictionaries";
import type { BusinessSize, BusinessType } from "@/lib/types";

type OnboardingCopy = (typeof dictionaries)["en"]["onboarding"];

interface OnboardingModalProps {
  t: OnboardingCopy;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: "cafe", label: "Café" },
  { value: "restaurant", label: "Restaurant" },
  { value: "hotel_restaurant", label: "Hotel Restaurant" },
  { value: "fast_food", label: "Fast Food" },
  { value: "cafeteria", label: "Cafeteria" },
  { value: "bakery", label: "Bakery" },
];

const BUSINESS_SIZES: { value: BusinessSize; label: string }[] = [
  { value: "1-5", label: "1–5 staff" },
  { value: "6-20", label: "6–20 staff" },
  { value: "21-50", label: "21–50 staff" },
  { value: "50+", label: "50+ staff" },
];

export function OnboardingModal({
  t,
  isOpen,
  onClose,
  onComplete,
}: OnboardingModalProps) {
  const { user, refreshProfile } = useAuth();
  const [name, setName] = useState("");
  const [city, setCity] = useState("Addis Ababa");
  const [businessType, setBusinessType] = useState<BusinessType | "">("");
  const [businessSize, setBusinessSize] = useState<BusinessSize | "">("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleClose = () => {
    if (saving) return;
    setDone(false);
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim() || !businessType || !businessSize) {
      setError(t.errorRequired);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const companyId = await companyService.create({
        name: name.trim(),
        ownerId: user.uid,
        businessType,
        businessSize,
        city: city.trim(),
        numberOfBranches: 1,
        isActive: true,
        onboardingChecklist: {
          profileCompleted: true,
          demoBooked: false,
          demoCompleted: false,
          firstReceiptPrinted: false,
          staffAdded: false,
          menuConfigured: false,
        },
      });
      await userService.update(user.uid, {
        companyId,
        onboardingCompleted: true,
        onboardingStep: 1,
      });
      await refreshProfile();
      setDone(true);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : t.errorSave);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalBackdrop onClose={handleClose}>
          <ModalPanel>
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <ModalScrollBody className="px-8 pt-8 pb-10">
              {done ? (
                <div className="text-center py-4">
                  <div className="mx-auto h-16 w-16 rounded-full gradient-teal flex items-center justify-center mb-6">
                    <Check className="h-8 w-8 text-background" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-ink">
                    {t.success}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      onComplete?.();
                      handleClose();
                    }}
                    className="mt-8 w-full rounded-xl gradient-burgundy text-background px-6 py-3 text-sm font-semibold"
                  >
                    {t.done}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-bold text-ink">
                    {t.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t.subtitle}
                  </p>
                  <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">
                        {t.companyName} *
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">
                        {t.city} *
                      </label>
                      <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-2">
                        {t.businessType} *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {BUSINESS_TYPES.map((bt) => (
                          <button
                            key={bt.value}
                            type="button"
                            onClick={() => setBusinessType(bt.value)}
                            className={`rounded-xl border px-3 py-2 text-sm ${
                              businessType === bt.value
                                ? "border-[oklch(0.5_0.08_195)] bg-[oklch(0.5_0.08_195)]/10 font-semibold"
                                : "border-border"
                            }`}
                          >
                            {bt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-2">
                        {t.businessSize} *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {BUSINESS_SIZES.map((bs) => (
                          <button
                            key={bs.value}
                            type="button"
                            onClick={() => setBusinessSize(bs.value)}
                            className={`rounded-xl border px-3 py-2 text-sm ${
                              businessSize === bs.value
                                ? "border-[oklch(0.5_0.08_195)] bg-[oklch(0.5_0.08_195)]/10 font-semibold"
                                : "border-border"
                            }`}
                          >
                            {bs.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full rounded-xl gradient-burgundy text-background py-3 text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t.saving}
                        </>
                      ) : (
                        t.continue
                      )}
                    </button>
                  </form>
                </>
              )}
            </ModalScrollBody>
          </ModalPanel>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
}
