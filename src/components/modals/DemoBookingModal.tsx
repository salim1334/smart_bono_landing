import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { companyService } from "@/lib/firestore";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Check,
  Calendar,
  Clock,
  Building2,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import {
  appointmentService,
  BookingError,
  isFirebaseConfigured,
  leadService,
  scheduleService,
} from "@/lib/firestore";
import {
  getAvailableDates,
  getLocalAvailableSlots,
  mergeScheduleConfig,
} from "@/lib/booking";
import { isValidPhone, isValidPhoneInput, normalizePhone } from "@/lib/phone";
import { cn } from "@/lib/utils";
import {
  ModalBackdrop,
  ModalFooter,
  ModalPanel,
  ModalScrollBody,
} from "@/components/modals/ModalFrame";
import type { dictionaries } from "@/locales/dictionaries";
import type {
  BusinessType,
  BusinessSize,
  DemoType,
  PreferredContact,
} from "@/lib/types";

type DemoBookingCopy = (typeof dictionaries)["en"]["demoBooking"];

interface DemoBookingModalProps {
  t: DemoBookingCopy;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: BusinessType | "";
  businessSize: BusinessSize | "";
  demoType: DemoType | "";
  preferredContact: PreferredContact | "";
  date: string;
  startTime: string;
  notes: string;
}

const BUSINESS_TYPES: { value: BusinessType; label: string; emoji: string }[] =
  [
    { value: "cafe", label: "Café", emoji: "☕" },
    { value: "restaurant", label: "Restaurant", emoji: "🍽️" },
    { value: "hotel_restaurant", label: "Hotel Restaurant", emoji: "🏨" },
    { value: "fast_food", label: "Fast Food", emoji: "🍔" },
    { value: "cafeteria", label: "Cafeteria", emoji: "🥗" },
    { value: "bakery", label: "Bakery", emoji: "🥐" },
  ];

const BUSINESS_SIZES: { value: BusinessSize; label: string }[] = [
  { value: "1-5", label: "1–5 staff" },
  { value: "6-20", label: "6–20 staff" },
  { value: "21-50", label: "21–50 staff" },
  { value: "50+", label: "50+ staff" },
];

const DEMO_TYPES: {
  value: DemoType;
  label: string;
  desc: string;
  icon: typeof Phone;
}[] = [
  {
    value: "online",
    label: "Online Demo",
    desc: "Video call, screen share",
    icon: Calendar,
  },
  {
    value: "phone_call",
    label: "Phone Call",
    desc: "Quick walkthrough call",
    icon: Phone,
  },
  {
    value: "in_person",
    label: "In-Person",
    desc: "We visit your cafe in Addis",
    icon: Building2,
  },
];

const CONTACT_METHODS: {
  value: PreferredContact;
  label: string;
  icon: typeof Phone;
}[] = [
  { value: "phone", label: "Phone Call", icon: Phone },
  { value: "telegram", label: "Telegram", icon: MessageSquare },
  { value: "email", label: "Email", icon: Mail },
  { value: "whatsapp", label: "WhatsApp", icon: Phone },
];

function mapFirebaseError(err: unknown, t: DemoBookingCopy): string {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code: string }).code)
      : "";
  if (err instanceof BookingError) {
    if (err.code === "slot_taken") return t.errorSlotTaken;
    if (err.code === "already_booked") return t.errorAlreadyBooked;
    if (err.code === "permission-denied") return t.errorPermission;
  }
  if (code === "permission-denied") return t.errorPermission;
  if (err instanceof Error && err.message.includes("not configured")) {
    return t.errorFirebase;
  }
  return err instanceof Error ? err.message : t.errorSubmit;
}

export function DemoBookingModal({
  t,
  isOpen,
  onClose,
  onSuccess,
}: DemoBookingModalProps) {
  const { user, profile } = useAuth();
  const STEPS = t.steps;
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [availableSlots, setAvailableSlots] = useState<
    Array<{ time: string; available: boolean }>
  >([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableDates, setAvailableDates] = useState<
    Array<{ value: string; label: string; day: string }>
  >([]);
  const [form, setForm] = useState<BookingForm>({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    businessSize: "",
    demoType: "",
    preferredContact: "",
    date: "",
    startTime: "",
    notes: "",
  });

  const update = (key: keyof BookingForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!isOpen || !user || !profile) return;
    setForm((f) => ({
      ...f,
      name: profile.displayName || f.name,
      email: profile.email || f.email,
      phone: profile.phone || f.phone,
    }));
    void companyService.getByOwner(user.uid).then((company) => {
      if (!company) return;
      setForm((f) => ({
        ...f,
        businessName: company.name,
        businessType: company.businessType,
        businessSize: company.businessSize,
      }));
    });
  }, [isOpen, user, profile]);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setSubmitted(false);
      setSubmitError("");
      setAvailableSlots([]);
      return;
    }
    setAvailableDates(getAvailableDates(mergeScheduleConfig(null)));
    void scheduleService
      .getOrDefault()
      .then((config) => setAvailableDates(getAvailableDates(config)))
      .catch((err) => console.warn("Using default schedule dates", err));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !form.date) {
      setAvailableSlots([]);
      return;
    }
    setAvailableSlots(getLocalAvailableSlots(form.date));
    setLoadingSlots(true);
    setSubmitError("");
    void scheduleService
      .generateAvailableSlots(form.date)
      .then((slots) => {
        const open = slots.filter((s) => s.available);
        setAvailableSlots(
          open.length > 0 ? slots : getLocalAvailableSlots(form.date),
        );
        if (
          form.startTime &&
          !slots.some((s) => s.time === form.startTime && s.available)
        ) {
          update("startTime", "");
        }
      })
      .catch((err) => {
        console.error("Failed to load slots:", err);
        setAvailableSlots(getLocalAvailableSlots(form.date));
      })
      .finally(() => setLoadingSlots(false));
  }, [isOpen, form.date]);

  const canProceed = () => {
    if (step === 0)
      return form.name.trim().length >= 2 && isValidPhoneInput(form.phone);
    if (step === 1) return form.businessType && form.businessSize;
    if (step === 2) return form.demoType && form.preferredContact;
    if (step === 3)
      return (
        form.date &&
        form.startTime &&
        availableSlots.some((s) => s.time === form.startTime && s.available)
      );
    return true;
  };

  const handleSubmit = async () => {
    if (!isFirebaseConfigured) {
      setSubmitError(t.errorFirebase);
      return;
    }
    const phone = normalizePhone(form.phone);
    if (!isValidPhone(phone)) {
      setSubmitError(t.errorSubmit);
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const [h, m] = form.startTime.split(":").map(Number);
      const endMinutes = h * 60 + m + 30;
      const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

      const leadPayload = {
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone,
        businessName: form.businessName || undefined,
        businessType: (form.businessType as BusinessType) || undefined,
        businessSize: (form.businessSize as BusinessSize) || undefined,
        source: "demo_booking" as const,
        status: "new" as const,
        preferredContact:
          (form.preferredContact as PreferredContact) || undefined,
        tags: ["demo_booked"],
        isArchived: false,
        userId: user?.uid,
      };
      const appointmentPayload = {
        userId: user?.uid,
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone,
        businessName: form.businessName || undefined,
        businessType: (form.businessType as BusinessType) || undefined,
        businessSize: (form.businessSize as BusinessSize) || undefined,
        demoType: form.demoType as DemoType,
        preferredContact: form.preferredContact as PreferredContact,
        date: form.date,
        startTime: form.startTime,
        endTime,
        status: "pending" as const,
        notes: form.notes.trim() || undefined,
      };

      const leadId = await leadService.create(leadPayload);

      await appointmentService.create({
        ...appointmentPayload,
        leadId,
      });

      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setSubmitError(mapFirebaseError(err, t));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalPanel>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <ModalScrollBody>
            <SuccessView t={t} onClose={onClose} form={form} />
          </ModalScrollBody>
        ) : (
          <>
            <ModalScrollBody className="px-8 pt-8 pb-4">
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-ink">
                  {t.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.subtitle}
                </p>
              </div>

              {/* Progress */}
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

              {/* Step content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {step === 0 && <StepInfo form={form} update={update} />}
                  {step === 1 && <StepBusiness form={form} update={update} />}
                  {step === 2 && <StepDemoSetup form={form} update={update} />}
                  {step === 3 && (
                    <StepPickTime
                      form={form}
                      update={update}
                      availableDates={availableDates}
                      availableSlots={availableSlots}
                      loadingSlots={loadingSlots}
                      t={t}
                    />
                  )}
                  {step === 4 && <StepConfirm form={form} />}
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
                {step < STEPS.length - 1 ? (
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
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl gradient-burgundy text-background px-4 py-3 text-sm font-semibold hover:opacity-95 transition disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {t.bookDemo} <Check className="h-4 w-4" />
                      </>
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

function StepInfo({
  form,
  update,
}: {
  form: BookingForm;
  update: (k: keyof BookingForm, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">
          Full name *
        </label>
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          onInput={(e) => update("name", e.currentTarget.value)}
          autoComplete="name"
          placeholder="Abebe Kebede"
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.5_0.08_195)] transition"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">
          Phone number *
        </label>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          onInput={(e) => update("phone", e.currentTarget.value)}
          placeholder="09 9XX XXX XXXX"
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.5_0.08_195)] transition"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">
          Email (optional)
        </label>
        <input
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="abebe@mycafe.et"
          type="email"
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.5_0.08_195)] transition"
        />
      </div>
    </div>
  );
}

function StepBusiness({
  form,
  update,
}: {
  form: BookingForm;
  update: (k: keyof BookingForm, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">
          Business name
        </label>
        <input
          value={form.businessName}
          onChange={(e) => update("businessName", e.target.value)}
          placeholder="Abyssinia Café"
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.5_0.08_195)] transition"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-foreground mb-2">
          Business type *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {BUSINESS_TYPES.map((bt) => (
            <button
              key={bt.value}
              onClick={() => update("businessType", bt.value)}
              className={`rounded-xl border p-3 text-center transition ${
                form.businessType === bt.value
                  ? "border-[oklch(0.5_0.08_195)] bg-[oklch(0.5_0.08_195)]/10"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <div className="text-xl mb-1">{bt.emoji}</div>
              <div className="text-xs font-medium">{bt.label}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-foreground mb-2">
          Business size *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {BUSINESS_SIZES.map((bs) => (
            <button
              key={bs.value}
              onClick={() => update("businessSize", bs.value)}
              className={`rounded-xl border px-4 py-2.5 text-sm text-left transition ${
                form.businessSize === bs.value
                  ? "border-[oklch(0.5_0.08_195)] bg-[oklch(0.5_0.08_195)]/10 font-semibold"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              {bs.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepDemoSetup({
  form,
  update,
}: {
  form: BookingForm;
  update: (k: keyof BookingForm, v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-foreground mb-2">
          Demo format *
        </label>
        <div className="space-y-2">
          {DEMO_TYPES.map((dt) => (
            <button
              key={dt.value}
              onClick={() => update("demoType", dt.value)}
              className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition ${
                form.demoType === dt.value
                  ? "border-[oklch(0.5_0.08_195)] bg-[oklch(0.5_0.08_195)]/10"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  form.demoType === dt.value
                    ? "gradient-teal text-background"
                    : "bg-muted"
                }`}
              >
                <dt.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">{dt.label}</div>
                <div className="text-xs text-muted-foreground">{dt.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-foreground mb-2">
          Preferred contact *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CONTACT_METHODS.map((cm) => (
            <button
              key={cm.value}
              onClick={() => update("preferredContact", cm.value)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition ${
                form.preferredContact === cm.value
                  ? "border-[oklch(0.5_0.08_195)] bg-[oklch(0.5_0.08_195)]/10 font-semibold"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <cm.icon className="h-4 w-4" />
              {cm.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">
          Questions or concerns (optional)
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Any specific topics you'd like us to cover..."
          rows={3}
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.5_0.08_195)] transition resize-none"
        />
      </div>
    </div>
  );
}

function StepPickTime({
  form,
  update,
  availableDates,
  availableSlots,
  loadingSlots,
  t,
}: {
  form: BookingForm;
  update: (k: keyof BookingForm, v: string) => void;
  availableDates: { value: string; label: string; day: string }[];
  availableSlots: Array<{ time: string; available: boolean }>;
  loadingSlots: boolean;
  t: DemoBookingCopy;
}) {
  const openSlots = availableSlots.filter((s) => s.available);
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-foreground mb-2">
          <Calendar className="inline h-3.5 w-3.5 mr-1" />
          Select date *
        </label>
        <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
          {availableDates.map((d) => (
            <button
              key={d.value}
              onClick={() => update("date", d.value)}
              className={`rounded-xl border p-2.5 text-center transition ${
                form.date === d.value
                  ? "gradient-burgundy text-background border-transparent"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <div className="text-[10px] uppercase tracking-wide opacity-70">
                {d.day}
              </div>
              <div className="text-sm font-bold mt-0.5">{d.label}</div>
            </button>
          ))}
        </div>
      </div>
      {form.date && (
        <div>
          <label className="block text-xs font-semibold text-foreground mb-2">
            <Clock className="inline h-3.5 w-3.5 mr-1" />
            {t.selectTime} *
          </label>
          {loadingSlots ? (
            <p className="text-sm text-muted-foreground py-4">
              {t.loadingSlots}
            </p>
          ) : openSlots.length === 0 ? (
            <p className="text-sm text-destructive py-2">{t.errorNoSlots}</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {openSlots.map(({ time }) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => update("startTime", time)}
                  className={`rounded-xl border py-2 text-sm text-center transition ${
                    form.startTime === time
                      ? "gradient-teal text-background border-transparent font-semibold"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StepConfirm({ form }: { form: BookingForm }) {
  const dateLabel = form.date
    ? new Date(form.date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Please review your booking details.
      </p>
      <div className="rounded-2xl border border-border bg-background/50 p-5 space-y-3">
        {[
          { label: "Name", value: form.name },
          { label: "Contact", value: form.phone || form.email },
          { label: "Business", value: form.businessName || form.businessType },
          { label: "Demo type", value: form.demoType?.replace("_", " ") },
          { label: "Date", value: dateLabel },
          { label: "Time", value: form.startTime && `${form.startTime} (EAT)` },
        ]
          .filter((r) => r.value)
          .map((row) => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium capitalize">{row.value}</span>
            </div>
          ))}
      </div>
      <div className="flex items-start gap-2 rounded-xl bg-[oklch(0.5_0.08_195)]/10 border border-[oklch(0.5_0.08_195)]/20 p-3">
        <Check className="h-4 w-4 text-[oklch(0.5_0.08_195)] shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Our team will confirm your booking and send a reminder before the
          demo.
        </p>
      </div>
    </div>
  );
}

function SuccessView({
  t,
  onClose,
  form,
}: {
  t: DemoBookingCopy;
  onClose: () => void;
  form: BookingForm;
}) {
  return (
    <div className="px-8 pt-8 pb-10 text-center">
      <div className="mx-auto h-16 w-16 rounded-full gradient-teal flex items-center justify-center mb-6">
        <Check className="h-8 w-8 text-background" />
      </div>
      <h2 className="font-display text-2xl font-bold text-ink">
        {t.successTitle}
      </h2>
      <p className="mt-3 text-muted-foreground">
        {t.successThanks},{" "}
        <span className="font-semibold text-foreground">{form.name}</span>!{" "}
        {t.successConfirm} {form.demoType?.replace("_", " ")} demo{" "}
        {form.date &&
          new Date(form.date + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}{" "}
        at <span className="font-semibold">{form.startTime} EAT</span>.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {t.successVia} {form.preferredContact?.replace("_", " ")}.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-8 w-full rounded-xl gradient-burgundy text-background px-6 py-3 text-sm font-semibold hover:opacity-95 transition"
      >
        {t.done}
      </button>
    </div>
  );
}
