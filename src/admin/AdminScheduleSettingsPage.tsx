import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { AdminLayout, AdminTopBar } from "@/admin/AdminLayout";
import { scheduleService } from "@/lib/firestore";
import { DEFAULT_SCHEDULE_CONFIG } from "@/lib/booking";
import type { ScheduleConfig } from "@/lib/types";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AdminScheduleSettingsPage() {
  const [config, setConfig] = useState<ScheduleConfig | null>(null);
  const [blockedInput, setBlockedInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void scheduleService.ensureDefault().then((c) => {
      setConfig(c);
      setBlockedInput(c.blockedDates.join("\n"));
      setLoading(false);
    });
  }, []);

  const toggleDay = (day: number) => {
    if (!config) return;
    const workingDays = config.workingDays.includes(day)
      ? config.workingDays.filter((d) => d !== day)
      : [...config.workingDays, day].sort();
    setConfig({ ...config, workingDays });
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setSaved(false);
    const blockedDates = blockedInput
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => /^\d{4}-\d{2}-\d{2}$/.test(s));
    try {
      await scheduleService.update({
        workingDays: config.workingDays,
        startHour: config.startHour,
        endHour: config.endHour,
        breakStartHour: config.breakStartHour,
        breakEndHour: config.breakEndHour,
        slotDurationMinutes: config.slotDurationMinutes,
        bufferMinutes: config.bufferMinutes,
        maxBookingsPerDay: config.maxBookingsPerDay,
        daysAhead: config.daysAhead,
        blockedDates,
        timezone: config.timezone,
      });
      setConfig({ ...config, blockedDates });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminTopBar
        title="Booking schedule"
        subtitle="Working hours and slots shown on the demo booking form"
        actions={
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl gradient-burgundy text-background px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </button>
        }
      />

      <div className="px-8 py-8 max-w-2xl space-y-8">
        {saved && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            Schedule saved. New bookings will use these rules immediately.
          </p>
        )}

        <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-display font-bold text-ink">Working days</h2>
          <div className="flex flex-wrap gap-2">
            {DAY_LABELS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => toggleDay(i)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                  config.workingDays.includes(i)
                    ? "gradient-teal text-background border-transparent"
                    : "border-border text-muted-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 grid sm:grid-cols-2 gap-4">
          <Field
            label="Start hour"
            type="number"
            min={6}
            max={12}
            value={config.startHour}
            onChange={(v) => setConfig({ ...config, startHour: v })}
          />
          <Field
            label="End hour"
            type="number"
            min={13}
            max={22}
            value={config.endHour}
            onChange={(v) => setConfig({ ...config, endHour: v })}
          />
          <Field
            label="Lunch break start (hour)"
            type="number"
            min={11}
            max={14}
            value={config.breakStartHour ?? DEFAULT_SCHEDULE_CONFIG.breakStartHour!}
            onChange={(v) => setConfig({ ...config, breakStartHour: v })}
          />
          <Field
            label="Lunch break end (hour)"
            type="number"
            min={12}
            max={15}
            value={config.breakEndHour ?? DEFAULT_SCHEDULE_CONFIG.breakEndHour!}
            onChange={(v) => setConfig({ ...config, breakEndHour: v })}
          />
          <Field
            label="Slot duration (minutes)"
            type="number"
            min={15}
            max={60}
            step={15}
            value={config.slotDurationMinutes}
            onChange={(v) => setConfig({ ...config, slotDurationMinutes: v })}
          />
          <Field
            label="Buffer between bookings (minutes)"
            type="number"
            min={0}
            max={30}
            value={config.bufferMinutes}
            onChange={(v) => setConfig({ ...config, bufferMinutes: v })}
          />
          <Field
            label="Max bookings per day"
            type="number"
            min={1}
            max={50}
            value={config.maxBookingsPerDay}
            onChange={(v) => setConfig({ ...config, maxBookingsPerDay: v })}
          />
          <Field
            label="Days ahead to show"
            type="number"
            min={7}
            max={60}
            value={config.daysAhead}
            onChange={(v) => setConfig({ ...config, daysAhead: v })}
          />
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h2 className="font-display font-bold text-ink">Blocked dates</h2>
          <p className="text-xs text-muted-foreground">
            One date per line (YYYY-MM-DD), e.g. holidays
          </p>
          <textarea
            value={blockedInput}
            onChange={(e) => setBlockedInput(e.target.value)}
            rows={4}
            placeholder="2026-01-07"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-mono"
          />
        </section>

        <p className="text-xs text-muted-foreground">
          Timezone: {config.timezone}. Slots are generated server-side from this
          config; double-booking is blocked with atomic slot locks.
        </p>
      </div>
    </AdminLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "number",
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5">{label}</label>
      <input
        type={type}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
      />
    </div>
  );
}
