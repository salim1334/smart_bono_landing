import type { ScheduleConfig } from "@/lib/types";

export const DEFAULT_SCHEDULE_CONFIG: Omit<
  ScheduleConfig,
  "id" | "updatedAt"
> = {
  workingDays: [1, 2, 3, 4, 5, 6],
  startHour: 9,
  endHour: 17,
  breakStartHour: 12,
  breakEndHour: 13,
  slotDurationMinutes: 30,
  bufferMinutes: 10,
  maxBookingsPerDay: 12,
  daysAhead: 14,
  blockedDates: [],
  timezone: "Africa/Addis_Ababa",
};

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function slotDocId(date: string, startTime: string): string {
  return `${date}_${startTime.replace(":", "")}`;
}

function overlapsBreak(
  slotStart: number,
  slotEnd: number,
  config: ScheduleConfig,
): boolean {
  if (config.breakStartHour == null || config.breakEndHour == null) return false;
  const breakStart = config.breakStartHour * 60;
  const breakEnd = config.breakEndHour * 60;
  return slotStart < breakEnd && slotEnd > breakStart;
}

function overlapsBooking(
  slotStart: number,
  slotEnd: number,
  booking: { startTime: string; endTime: string },
  bufferMinutes: number,
): boolean {
  const bookedStart = timeToMinutes(booking.startTime);
  const bookedEnd = timeToMinutes(booking.endTime) + bufferMinutes;
  return slotStart < bookedEnd && slotEnd > bookedStart;
}

export function generateSlotTimes(config: ScheduleConfig): string[] {
  const normalized = normalizeScheduleConfig(config);
  const slots: string[] = [];
  const step = normalized.slotDurationMinutes;
  const { startHour, endHour } = normalized;
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += step) {
      const start = hour * 60 + min;
      const end = start + step;
      if (end > endHour * 60) continue;
      if (overlapsBreak(start, end, normalized)) continue;
      slots.push(minutesToTime(start));
    }
  }
  return slots;
}

/** Coerce Firestore / form values so slot math never silently returns zero slots. */
export function normalizeScheduleConfig(config: ScheduleConfig): ScheduleConfig {
  const workingDays = Array.isArray(config.workingDays)
    ? config.workingDays
        .map((d) => (typeof d === "string" ? parseInt(d, 10) : Number(d)))
        .filter((d) => !Number.isNaN(d) && d >= 0 && d <= 6)
    : [...DEFAULT_SCHEDULE_CONFIG.workingDays];

  let startHour = Number(config.startHour);
  let endHour = Number(config.endHour);
  if (Number.isNaN(startHour)) startHour = DEFAULT_SCHEDULE_CONFIG.startHour;
  if (Number.isNaN(endHour)) endHour = DEFAULT_SCHEDULE_CONFIG.endHour;
  if (endHour <= startHour) {
    startHour = DEFAULT_SCHEDULE_CONFIG.startHour;
    endHour = DEFAULT_SCHEDULE_CONFIG.endHour;
  }

  const slotDurationMinutes = Math.max(
    15,
    Number(config.slotDurationMinutes) || DEFAULT_SCHEDULE_CONFIG.slotDurationMinutes,
  );
  const bufferMinutes = Math.max(
    0,
    Number(config.bufferMinutes) ?? DEFAULT_SCHEDULE_CONFIG.bufferMinutes,
  );
  const maxBookingsPerDay = Math.max(
    1,
    Number(config.maxBookingsPerDay) || DEFAULT_SCHEDULE_CONFIG.maxBookingsPerDay,
  );
  const daysAhead = Math.max(
    7,
    Number(config.daysAhead) || DEFAULT_SCHEDULE_CONFIG.daysAhead,
  );

  return {
    ...config,
    workingDays: workingDays.length > 0 ? workingDays : [...DEFAULT_SCHEDULE_CONFIG.workingDays],
    startHour,
    endHour,
    breakStartHour:
      config.breakStartHour != null
        ? Number(config.breakStartHour)
        : DEFAULT_SCHEDULE_CONFIG.breakStartHour,
    breakEndHour:
      config.breakEndHour != null
        ? Number(config.breakEndHour)
        : DEFAULT_SCHEDULE_CONFIG.breakEndHour,
    slotDurationMinutes,
    bufferMinutes,
    maxBookingsPerDay,
    daysAhead,
    blockedDates: Array.isArray(config.blockedDates) ? config.blockedDates : [],
  };
}

export function getAvailableDates(config: ScheduleConfig): Array<{
  value: string;
  label: string;
  day: string;
}> {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dates: Array<{ value: string; label: string; day: string }> = [];
  const current = new Date();
  current.setDate(current.getDate() + 1);

  while (dates.length < config.daysAhead) {
    const dayOfWeek = current.getDay();
    const value = formatDateLocal(current);
    if (
      config.workingDays.includes(dayOfWeek) &&
      !config.blockedDates.includes(value)
    ) {
      dates.push({
        value,
        label: `${current.getDate()} ${months[current.getMonth()]}`,
        day: days[dayOfWeek],
      });
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/** YYYY-MM-DD in local calendar (avoids UTC shift from toISOString). */
export function formatDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function computeEndTime(startTime: string, durationMinutes: number): string {
  const end = timeToMinutes(startTime) + durationMinutes;
  return minutesToTime(end);
}

type SlotBooking = { startTime: string; endTime: string };

export function getAvailableSlotsForDate(
  config: ScheduleConfig,
  date: string,
  lockedSlots: SlotBooking[],
): Array<{ time: string; available: boolean }> {
  const normalized = normalizeScheduleConfig(config);
  const dayOfWeek = parseDateDayOfWeek(date);
  if (!normalized.workingDays.includes(dayOfWeek)) return [];
  if (normalized.blockedDates.includes(date)) return [];

  const allSlots = generateSlotTimes(normalized);
  if (allSlots.length === 0) return [];

  if (lockedSlots.length >= normalized.maxBookingsPerDay) {
    return allSlots.map((time) => ({ time, available: false }));
  }

  const duration = normalized.slotDurationMinutes;
  const buffer = normalized.bufferMinutes;

  return allSlots.map((time) => {
    const slotStart = timeToMinutes(time);
    const slotEnd = slotStart + duration;
    const taken = lockedSlots.some((b) =>
      overlapsBooking(slotStart, slotEnd, b, buffer),
    );
    return { time, available: !taken };
  });
}

/** Slots from defaults only — works without Firestore (instant UI). */
export function getLocalAvailableSlots(
  date: string,
): Array<{ time: string; available: boolean }> {
  return getAvailableSlotsForDate(mergeScheduleConfig(null), date, []);
}

/** Parse YYYY-MM-DD as local calendar day (avoids UTC midnight shifting the weekday). */
export function parseDateDayOfWeek(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

export function validateBookingSlot(
  config: ScheduleConfig,
  date: string,
  startTime: string,
  lockedSlots: SlotBooking[],
): { ok: true } | { ok: false; reason: string } {
  const dayOfWeek = parseDateDayOfWeek(date);
  if (!config.workingDays.includes(dayOfWeek)) {
    return { ok: false, reason: "not_working_day" };
  }
  if (config.blockedDates.includes(date)) {
    return { ok: false, reason: "blocked_date" };
  }

  const slots = generateSlotTimes(config);
  if (!slots.includes(startTime)) {
    return { ok: false, reason: "invalid_slot" };
  }

  const maxPerDay =
    config.maxBookingsPerDay ?? DEFAULT_SCHEDULE_CONFIG.maxBookingsPerDay;
  if (lockedSlots.length >= maxPerDay) {
    return { ok: false, reason: "day_full" };
  }

  const duration =
    config.slotDurationMinutes ?? DEFAULT_SCHEDULE_CONFIG.slotDurationMinutes;
  const buffer = config.bufferMinutes ?? DEFAULT_SCHEDULE_CONFIG.bufferMinutes;
  const slotStart = timeToMinutes(startTime);
  const slotEnd = slotStart + duration;
  const conflict = lockedSlots.some((b) =>
    overlapsBooking(slotStart, slotEnd, b, buffer),
  );
  if (conflict) return { ok: false, reason: "slot_taken" };

  return { ok: true };
}

export function mergeScheduleConfig(
  partial: Partial<ScheduleConfig> | null,
): ScheduleConfig {
  const merged = {
    id: "default",
    ...DEFAULT_SCHEDULE_CONFIG,
    ...partial,
    updatedAt: partial?.updatedAt ?? ({} as ScheduleConfig["updatedAt"]),
  };
  return normalizeScheduleConfig(merged);
}
