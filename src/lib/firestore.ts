import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
  DocumentData,
  writeBatch,
  runTransaction,
} from "firebase/firestore";
import { getClientDb, isFirebaseConfigured } from "@/firebase";

function getDb() {
  const db = getClientDb();
  if (!db) {
    throw new Error(
      "Firebase is not configured. Copy .env.example to .env and add your Firebase web app keys.",
    );
  }
  return db;
}

export { isFirebaseConfigured };
import type {
  UserProfile,
  Lead,
  LeadStatus,
  Company,
  Appointment,
  AppointmentStatus,
  ContentItem,
  Testimonial,
  FAQ,
  NewsletterSubscriber,
  ContactFormSubmission,
  ActivityLog,
  ScheduleConfig,
  BookedSlot,
  PlanTier,
  PricingSectionContent,
  PricingTierContent,
  SiteBannerContent,
  PricingConfigUI,
  ActiveSiteBanner,
} from "@/lib/types";
import type { Language } from "@/locales/dictionaries";
import {
  PRICING_SECTION_KEY,
  PROMO_BANNER_KEY,
  PLAN_TIER_ORDER,
  pricingTierKey,
  serializeContentBody,
  contentToSection,
  contentToTier,
  contentToBanner,
  isBannerScheduled,
} from "@/lib/cms";
import {
  getDefaultPricingSectionContent,
  getDefaultPricingTierContent,
  getDefaultSiteBannerContent,
  buildPricingConfigUI,
  getDefaultPricingConfigUI,
} from "@/lib/cms-defaults";
import {
  computeEndTime,
  DEFAULT_SCHEDULE_CONFIG,
  getAvailableSlotsForDate,
  mergeScheduleConfig,
  slotDocId,
  validateBookingSlot,
} from "@/lib/booking";

// ─── Collections ─────────────────────────────────────────────────────────────

export const COLLECTIONS = {
  USERS: "users",
  LEADS: "leads",
  COMPANIES: "companies",
  APPOINTMENTS: "appointments",
  CONTENT: "content",
  TESTIMONIALS: "testimonials",
  FAQS: "faqs",
  NEWSLETTER: "newsletter_subscribers",
  CONTACT_FORMS: "contact_form_submissions",
  ACTIVITY_LOGS: "activity_logs",
  SCHEDULE_CONFIG: "schedule_config",
  BOOKED_SLOTS: "booked_slots",
  BOOKING_LOCKS: "booking_locks",
} as const;

/** Statuses that count as an active demo booking (blocks another booking). */
const BLOCKING_APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "pending",
  "confirmed",
  "rescheduled",
];

const RELEASE_BOOKING_LOCK_STATUSES: AppointmentStatus[] = [
  "cancelled",
  "completed",
  "no_show",
];

function bookingLockIds(userId: string | undefined, phone: string): string[] {
  const ids = [`phone_${phone.replace(/\D/g, "")}`];
  if (userId) ids.push(`uid_${userId}`);
  return ids;
}

export class BookingError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "slot_taken"
      | "invalid_slot"
      | "blocked_date"
      | "not_working_day"
      | "day_full"
      | "permission-denied"
      | "already_booked"
      | "unknown",
  ) {
    super(message);
    this.name = "BookingError";
  }
}

// ─── Generic helpers ──────────────────────────────────────────────────────────

/** Firestore rejects `undefined` field values; omit those keys before writes. */
function stripUndefined<T extends object>(data: T): T {
  const out = { ...data };
  for (const key of Object.keys(out) as (keyof T)[]) {
    if (out[key] === undefined) delete out[key];
  }
  return out;
}

async function getDocument<T>(
  collectionName: string,
  id: string,
): Promise<T | null> {
  const ref = doc(getDb(), collectionName, id);
  const snap = await getDoc(ref);
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
}

async function queryDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[],
): Promise<T[]> {
  const ref = collection(getDb(), collectionName);
  const q = query(ref, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export const userService = {
  async create(uid: string, data: Partial<UserProfile>): Promise<void> {
    const ref = doc(getDb(), COLLECTIONS.USERS, uid);
    await setDoc(ref, {
      uid,
      role: "user",
      onboardingCompleted: false,
      onboardingStep: 0,
      notificationPreferences: {
        email: true,
        marketing: true,
        bookingReminders: true,
        onboardingReminders: true,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...data,
    });
  },

  async get(uid: string): Promise<UserProfile | null> {
    const ref = doc(getDb(), COLLECTIONS.USERS, uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as UserProfile) : null;
  },

  async update(uid: string, data: Partial<UserProfile>): Promise<void> {
    const ref = doc(getDb(), COLLECTIONS.USERS, uid);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  },

  async getAll(): Promise<UserProfile[]> {
    const ref = collection(getDb(), COLLECTIONS.USERS);
    const q = query(ref, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as UserProfile);
  },

  subscribeToProfile(
    uid: string,
    callback: (profile: UserProfile | null) => void,
  ) {
    const ref = doc(getDb(), COLLECTIONS.USERS, uid);
    return onSnapshot(ref, (snap) => {
      callback(snap.exists() ? (snap.data() as UserProfile) : null);
    });
  },

  subscribeToAll(callback: (users: UserProfile[]) => void) {
    const ref = collection(getDb(), COLLECTIONS.USERS);
    const q = query(ref, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => d.data() as UserProfile));
    });
  },

  async findByEmail(email: string): Promise<UserProfile | null> {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return null;
    const users = await this.getAll();
    return (
      users.find((u) => u.email?.trim().toLowerCase() === normalized) ?? null
    );
  },

  async updateRole(
    targetUid: string,
    role: UserProfile["role"],
    actor: { uid: string; email: string },
  ): Promise<void> {
    await this.update(targetUid, { role });
    await activityLogService.create({
      adminId: actor.uid,
      adminEmail: actor.email,
      action: `User role set to ${role}`,
      resourceType: "user",
      resourceId: targetUid,
      details: { role },
    });
  },
};

// ─── Lead Service ─────────────────────────────────────────────────────────────

export const leadService = {
  async create(
    data: Omit<Lead, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    const ref = collection(getDb(), COLLECTIONS.LEADS);
    const payload = stripUndefined({
      ...data,
      tags: data.tags || [],
      isArchived: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const docRef = await addDoc(ref, payload);
    return docRef.id;
  },

  async get(id: string): Promise<Lead | null> {
    return getDocument<Lead>(COLLECTIONS.LEADS, id);
  },

  async update(id: string, data: Partial<Lead>): Promise<void> {
    const ref = doc(getDb(), COLLECTIONS.LEADS, id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  },

  async updateStatus(
    id: string,
    status: LeadStatus,
    adminId: string,
  ): Promise<void> {
    const ref = doc(getDb(), COLLECTIONS.LEADS, id);
    await updateDoc(ref, {
      status,
      updatedAt: serverTimestamp(),
      lastContactedAt: status === "contacted" ? serverTimestamp() : undefined,
    });
    await activityLogService.create({
      adminId,
      adminEmail: "",
      action: `Lead status changed to ${status}`,
      resourceType: "lead",
      resourceId: id,
      details: { newStatus: status },
    });
  },

  async getAll(filters?: {
    status?: LeadStatus;
    isArchived?: boolean;
    source?: string;
  }): Promise<Lead[]> {
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
    if (filters?.status)
      constraints.push(where("status", "==", filters.status));
    if (filters?.isArchived !== undefined)
      constraints.push(where("isArchived", "==", filters.isArchived));
    return queryDocuments<Lead>(COLLECTIONS.LEADS, constraints);
  },

  async getRecent(limitCount = 10): Promise<Lead[]> {
    return queryDocuments<Lead>(COLLECTIONS.LEADS, [
      orderBy("createdAt", "desc"),
      limit(limitCount),
    ]);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(getDb(), COLLECTIONS.LEADS, id));
  },

  subscribeToAll(
    callback: (leads: Lead[]) => void,
    filters?: { status?: LeadStatus; isArchived?: boolean },
  ) {
    const constraints: QueryConstraint[] = [
      orderBy("createdAt", "desc"),
      limit(100),
    ];
    if (filters?.status)
      constraints.push(where("status", "==", filters.status));
    if (filters?.isArchived !== undefined)
      constraints.push(where("isArchived", "==", filters.isArchived));
    const q = query(collection(getDb(), COLLECTIONS.LEADS), ...constraints);
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Lead));
    });
  },
};

// ─── Company / Onboarding Service ────────────────────────────────────────────

export const companyService = {
  async create(
    data: Omit<Company, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    const ref = collection(getDb(), COLLECTIONS.COMPANIES);
    const docRef = await addDoc(ref, {
      ...data,
      isActive: true,
      onboardingChecklist: {
        profileCompleted: false,
        demoBooked: false,
        demoCompleted: false,
        firstReceiptPrinted: false,
        staffAdded: false,
        menuConfigured: false,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async get(id: string): Promise<Company | null> {
    return getDocument<Company>(COLLECTIONS.COMPANIES, id);
  },

  async update(id: string, data: Partial<Company>): Promise<void> {
    const ref = doc(getDb(), COLLECTIONS.COMPANIES, id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  },

  async getByOwner(ownerId: string): Promise<Company | null> {
    const results = await queryDocuments<Company>(COLLECTIONS.COMPANIES, [
      where("ownerId", "==", ownerId),
      limit(1),
    ]);
    return results[0] || null;
  },

  async getAll(): Promise<Company[]> {
    return queryDocuments<Company>(COLLECTIONS.COMPANIES, [
      orderBy("createdAt", "desc"),
    ]);
  },

  async updateChecklist(
    id: string,
    key: keyof Company["onboardingChecklist"],
  ): Promise<void> {
    const ref = doc(getDb(), COLLECTIONS.COMPANIES, id);
    await updateDoc(ref, {
      [`onboardingChecklist.${key}`]: true,
      updatedAt: serverTimestamp(),
    });
  },
};

// ─── Appointment Service ──────────────────────────────────────────────────────

async function findBlockingAppointment(
  phone: string,
  userId?: string,
): Promise<Appointment | null> {
  if (userId) {
    const byUser = await queryDocuments<Appointment>(COLLECTIONS.APPOINTMENTS, [
      where("userId", "==", userId),
      where("status", "in", BLOCKING_APPOINTMENT_STATUSES),
      limit(1),
    ]);
    if (byUser.length > 0) return byUser[0];
  }
  const byPhone = await queryDocuments<Appointment>(COLLECTIONS.APPOINTMENTS, [
    where("phone", "==", phone),
    where("status", "in", BLOCKING_APPOINTMENT_STATUSES),
    limit(1),
  ]);
  return byPhone[0] ?? null;
}

async function releaseBookingLocksForAppointment(
  appointment: Appointment,
): Promise<void> {
  const db = getDb();
  await Promise.all(
    bookingLockIds(appointment.userId, appointment.phone).map(async (lockId) => {
      const ref = doc(db, COLLECTIONS.BOOKING_LOCKS, lockId);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data()?.appointmentId === appointment.id) {
        await deleteDoc(ref);
      }
    }),
  );
}

export const appointmentService = {
  async create(
    data: Omit<Appointment, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    return appointmentService.createValidated(data);
  },

  /** Atomic booking: locks slot + creates appointment (prevents double-booking). */
  async createValidated(
    data: Omit<Appointment, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    const db = getDb();
    const config = mergeScheduleConfig(await scheduleService.get());
    const slotId = slotDocId(data.date, data.startTime);
    const slotRef = doc(db, COLLECTIONS.BOOKED_SLOTS, slotId);
    const endTime =
      data.endTime ||
      computeEndTime(data.startTime, config.slotDurationMinutes);

    const lockedSlots = await bookedSlotService.getForDate(
      data.date,
      config.slotDurationMinutes,
    );

    const validation = validateBookingSlot(
      config,
      data.date,
      data.startTime,
      lockedSlots,
    );
    if (!validation.ok) {
      throw new BookingError(
        `Booking not available (${validation.reason})`,
        validation.reason as BookingError["code"],
      );
    }

    const existingBooking = await findBlockingAppointment(
      data.phone,
      data.userId,
    );
    if (existingBooking) {
      throw new BookingError(
        "You already have a demo booked",
        "already_booked",
      );
    }

    const lockIds = bookingLockIds(data.userId, data.phone);

    try {
      return await runTransaction(db, async (tx) => {
        for (const lockId of lockIds) {
          const lockSnap = await tx.get(
            doc(db, COLLECTIONS.BOOKING_LOCKS, lockId),
          );
          if (lockSnap.exists()) {
            throw new BookingError(
              "You already have a demo booked",
              "already_booked",
            );
          }
        }

        const existingSlot = await tx.get(slotRef);
        if (existingSlot.exists()) {
          throw new BookingError("This time slot was just booked", "slot_taken");
        }

        const appointmentRef = doc(collection(db, COLLECTIONS.APPOINTMENTS));
        tx.set(slotRef, {
          date: data.date,
          startTime: data.startTime,
          endTime,
          appointmentId: appointmentRef.id,
          createdAt: serverTimestamp(),
        });
        const appointmentPayload = stripUndefined({
          ...data,
          endTime,
          status: "pending" as const,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        tx.set(appointmentRef, appointmentPayload);
        for (const lockId of lockIds) {
          tx.set(doc(db, COLLECTIONS.BOOKING_LOCKS, lockId), {
            appointmentId: appointmentRef.id,
            phone: data.phone,
            ...(data.userId ? { userId: data.userId } : {}),
            createdAt: serverTimestamp(),
          });
        }
        return appointmentRef.id;
      });
    } catch (err) {
      if (err instanceof BookingError) throw err;
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code: string }).code)
          : "";
      if (code === "permission-denied") {
        throw new BookingError(
          "Permission denied. Deploy Firestore rules.",
          "permission-denied",
        );
      }
      if (code === "already-exists" || code === "aborted") {
        throw new BookingError("This time slot was just booked", "slot_taken");
      }
      throw err;
    }
  },

  async getByDate(date: string): Promise<Appointment[]> {
    return queryDocuments<Appointment>(COLLECTIONS.APPOINTMENTS, [
      where("date", "==", date),
    ]);
  },

  async get(id: string): Promise<Appointment | null> {
    return getDocument<Appointment>(COLLECTIONS.APPOINTMENTS, id);
  },

  async update(id: string, data: Partial<Appointment>): Promise<void> {
    const ref = doc(getDb(), COLLECTIONS.APPOINTMENTS, id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  },

  async updateStatus(
    id: string,
    status: AppointmentStatus,
    adminId: string,
    details?: { cancelReason?: string; outcome?: string; meetingLink?: string },
  ): Promise<void> {
    const appointment = await appointmentService.get(id);
    const ref = doc(getDb(), COLLECTIONS.APPOINTMENTS, id);
    await updateDoc(ref, {
      status,
      ...details,
      updatedAt: serverTimestamp(),
    });

    if (status === "cancelled" && appointment) {
      await bookedSlotService.release(
        appointment.date,
        appointment.startTime,
      );
    }

    if (
      appointment &&
      RELEASE_BOOKING_LOCK_STATUSES.includes(status)
    ) {
      await releaseBookingLocksForAppointment(appointment);
    }

    await activityLogService.create({
      adminId,
      adminEmail: "",
      action: `Appointment status changed to ${status}`,
      resourceType: "appointment",
      resourceId: id,
      details: { newStatus: status, ...details },
    });
  },

  async getAll(filters?: {
    status?: AppointmentStatus;
    date?: string;
    assignedAdmin?: string;
  }): Promise<Appointment[]> {
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
    if (filters?.status)
      constraints.push(where("status", "==", filters.status));
    if (filters?.date) constraints.push(where("date", "==", filters.date));
    return queryDocuments<Appointment>(COLLECTIONS.APPOINTMENTS, constraints);
  },

  async getByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Appointment[]> {
    return queryDocuments<Appointment>(COLLECTIONS.APPOINTMENTS, [
      where("date", ">=", startDate),
      where("date", "<=", endDate),
      orderBy("date", "asc"),
    ]);
  },

  subscribeToAll(callback: (appointments: Appointment[]) => void) {
    const q = query(
      collection(getDb(), COLLECTIONS.APPOINTMENTS),
      orderBy("createdAt", "desc"),
      limit(100),
    );
    return onSnapshot(q, (snap) => {
      callback(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment),
      );
    });
  },
};

// ─── Content / CMS Service ───────────────────────────────────────────────────

export const contentService = {
  async upsert(key: string, data: Partial<ContentItem>): Promise<void> {
    const ref = doc(getDb(), COLLECTIONS.CONTENT, key);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    } else {
      await setDoc(ref, {
        ...data,
        key,
        isPublished: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  },

  async get(key: string): Promise<ContentItem | null> {
    return getDocument<ContentItem>(COLLECTIONS.CONTENT, key);
  },

  async getByType(type: ContentItem["type"]): Promise<ContentItem[]> {
    return queryDocuments<ContentItem>(COLLECTIONS.CONTENT, [
      where("type", "==", type),
      where("isPublished", "==", true),
      orderBy("order", "asc"),
    ]);
  },

  async getAll(): Promise<ContentItem[]> {
    return queryDocuments<ContentItem>(COLLECTIONS.CONTENT, [
      orderBy("updatedAt", "desc"),
    ]);
  },

  async getPricingSectionRaw(): Promise<ContentItem | null> {
    return this.get(PRICING_SECTION_KEY);
  },

  async getPricingTierRaw(tierId: PlanTier): Promise<ContentItem | null> {
    return this.get(pricingTierKey(tierId));
  },

  async getSiteBannerRaw(): Promise<ContentItem | null> {
    return this.get(PROMO_BANNER_KEY);
  },

  async loadPricingContent(lang: Language): Promise<PricingConfigUI> {
    if (!isFirebaseConfigured) {
      return getDefaultPricingConfigUI(lang);
    }
    try {
      const sectionItem = await this.get(PRICING_SECTION_KEY);
      const section = contentToSection(sectionItem);
      if (!sectionItem?.isPublished || !section) {
        return getDefaultPricingConfigUI(lang);
      }
      const tiers: PricingTierContent[] = [];
      for (const tierId of PLAN_TIER_ORDER) {
        const item = await this.get(pricingTierKey(tierId));
        const tier = contentToTier(item);
        if (item?.isPublished && tier) {
          tiers.push(tier);
        } else {
          tiers.push(getDefaultPricingTierContent(tierId));
        }
      }
      return buildPricingConfigUI(section, tiers, lang);
    } catch (err) {
      console.warn("CMS pricing load failed, using defaults", err);
      return getDefaultPricingConfigUI(lang);
    }
  },

  async getActiveSiteBanner(): Promise<ActiveSiteBanner | null> {
    if (!isFirebaseConfigured) return null;
    try {
      const item = await this.get(PROMO_BANNER_KEY);
      const content = contentToBanner(item);
      if (!item?.isPublished || !content) return null;
      if (!isBannerScheduled(content)) return null;
      const dismissKey =
        item.updatedAt?.toMillis?.()?.toString() ??
        item.id ??
        PROMO_BANNER_KEY;
      return { content, dismissKey, isPublished: true };
    } catch (err) {
      console.warn("CMS banner load failed", err);
      return null;
    }
  },

  async savePricingSection(
    data: PricingSectionContent,
    adminId: string,
    isPublished = true,
  ): Promise<void> {
    await this.upsert(PRICING_SECTION_KEY, {
      type: "pricing",
      key: PRICING_SECTION_KEY,
      body: serializeContentBody(data),
      order: 0,
      isPublished,
      updatedBy: adminId,
    });
  },

  async savePricingTier(
    tierId: PlanTier,
    data: PricingTierContent,
    adminId: string,
    isPublished = true,
  ): Promise<void> {
    const key = pricingTierKey(tierId);
    await this.upsert(key, {
      type: "pricing",
      key,
      body: serializeContentBody(data),
      order: data.order,
      isPublished,
      updatedBy: adminId,
    });
  },

  async saveSiteBanner(
    data: SiteBannerContent,
    adminId: string,
    isPublished = true,
  ): Promise<void> {
    await this.upsert(PROMO_BANNER_KEY, {
      type: "site_banner",
      key: PROMO_BANNER_KEY,
      body: serializeContentBody(data),
      order: 0,
      isPublished,
      updatedBy: adminId,
    });
  },

  async ensurePricingDefaults(adminId: string): Promise<void> {
    if (!isFirebaseConfigured) return;
    const section = await this.get(PRICING_SECTION_KEY);
    if (!section) {
      await this.savePricingSection(
        getDefaultPricingSectionContent(),
        adminId,
      );
    }
    for (const tierId of PLAN_TIER_ORDER) {
      const existing = await this.get(pricingTierKey(tierId));
      if (!existing) {
        await this.savePricingTier(
          tierId,
          getDefaultPricingTierContent(tierId),
          adminId,
        );
      }
    }
    const banner = await this.get(PROMO_BANNER_KEY);
    if (!banner) {
      await this.saveSiteBanner(getDefaultSiteBannerContent(), adminId, false);
    }
  },

  async loadPricingForAdmin(): Promise<{
    section: PricingSectionContent;
    tiers: Record<PlanTier, PricingTierContent>;
    banner: SiteBannerContent;
    sectionPublished: boolean;
    tiersPublished: Record<PlanTier, boolean>;
    bannerPublished: boolean;
  }> {
    const sectionItem = await this.get(PRICING_SECTION_KEY);
    const section =
      contentToSection(sectionItem) ?? getDefaultPricingSectionContent();
    const tiers = {} as Record<PlanTier, PricingTierContent>;
    const tiersPublished = {} as Record<PlanTier, boolean>;
    for (const tierId of PLAN_TIER_ORDER) {
      const item = await this.get(pricingTierKey(tierId));
      tiers[tierId] =
        contentToTier(item) ?? getDefaultPricingTierContent(tierId);
      tiersPublished[tierId] = item?.isPublished ?? true;
    }
    const bannerItem = await this.get(PROMO_BANNER_KEY);
    const banner =
      contentToBanner(bannerItem) ?? getDefaultSiteBannerContent();
    return {
      section,
      tiers,
      banner,
      sectionPublished: sectionItem?.isPublished ?? true,
      tiersPublished,
      bannerPublished: bannerItem?.isPublished ?? false,
    };
  },
};

// ─── Testimonial Service ──────────────────────────────────────────────────────

export const testimonialService = {
  async create(
    data: Omit<Testimonial, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    const ref = collection(getDb(), COLLECTIONS.TESTIMONIALS);
    const docRef = await addDoc(ref, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getPublished(): Promise<Testimonial[]> {
    return queryDocuments<Testimonial>(COLLECTIONS.TESTIMONIALS, [
      where("isPublished", "==", true),
      orderBy("order", "asc"),
    ]);
  },

  async getAll(): Promise<Testimonial[]> {
    return queryDocuments<Testimonial>(COLLECTIONS.TESTIMONIALS, [
      orderBy("order", "asc"),
    ]);
  },

  async update(id: string, data: Partial<Testimonial>): Promise<void> {
    await updateDoc(doc(getDb(), COLLECTIONS.TESTIMONIALS, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(getDb(), COLLECTIONS.TESTIMONIALS, id));
  },
};

// ─── FAQ Service ─────────────────────────────────────────────────────────────

export const faqService = {
  async getPublished(): Promise<FAQ[]> {
    return queryDocuments<FAQ>(COLLECTIONS.FAQS, [
      where("isPublished", "==", true),
      orderBy("order", "asc"),
    ]);
  },

  async getAll(): Promise<FAQ[]> {
    return queryDocuments<FAQ>(COLLECTIONS.FAQS, [orderBy("order", "asc")]);
  },

  async upsert(id: string, data: Partial<FAQ>): Promise<void> {
    const ref = doc(getDb(), COLLECTIONS.FAQS, id);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    } else {
      await setDoc(ref, {
        ...data,
        id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(getDb(), COLLECTIONS.FAQS, id));
  },
};

// ─── Newsletter Service ───────────────────────────────────────────────────────

export const newsletterService = {
  async subscribe(
    email: string,
    name?: string,
    source?: string,
  ): Promise<void> {
    const existing = await queryDocuments<NewsletterSubscriber>(
      COLLECTIONS.NEWSLETTER,
      [where("email", "==", email)],
    );
    if (existing.length > 0) {
      if (!existing[0].isActive) {
        await updateDoc(doc(getDb(), COLLECTIONS.NEWSLETTER, existing[0].id), {
          isActive: true,
          subscribedAt: serverTimestamp(),
          unsubscribedAt: null,
        });
      }
      return;
    }
    await addDoc(collection(getDb(), COLLECTIONS.NEWSLETTER), {
      email,
      name: name || "",
      source: source || "landing_page",
      isActive: true,
      subscribedAt: serverTimestamp(),
    });
  },

  async unsubscribe(email: string): Promise<void> {
    const existing = await queryDocuments<NewsletterSubscriber>(
      COLLECTIONS.NEWSLETTER,
      [where("email", "==", email)],
    );
    if (existing.length > 0) {
      await updateDoc(doc(getDb(), COLLECTIONS.NEWSLETTER, existing[0].id), {
        isActive: false,
        unsubscribedAt: serverTimestamp(),
      });
    }
  },

  async getAll(): Promise<NewsletterSubscriber[]> {
    return queryDocuments<NewsletterSubscriber>(COLLECTIONS.NEWSLETTER, [
      where("isActive", "==", true),
      orderBy("subscribedAt", "desc"),
    ]);
  },
};

// ─── Contact Form Service ─────────────────────────────────────────────────────

export const contactFormService = {
  async submit(
    data: Omit<ContactFormSubmission, "id" | "createdAt" | "status">,
  ): Promise<string> {
    const ref = collection(getDb(), COLLECTIONS.CONTACT_FORMS);
    const docRef = await addDoc(ref, {
      ...data,
      status: "new",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getAll(
    status?: ContactFormSubmission["status"],
  ): Promise<ContactFormSubmission[]> {
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
    if (status) constraints.push(where("status", "==", status));
    return queryDocuments<ContactFormSubmission>(
      COLLECTIONS.CONTACT_FORMS,
      constraints,
    );
  },

  async updateStatus(
    id: string,
    status: ContactFormSubmission["status"],
  ): Promise<void> {
    await updateDoc(doc(getDb(), COLLECTIONS.CONTACT_FORMS, id), {
      status,
      ...(status === "responded" ? { respondedAt: serverTimestamp() } : {}),
    });
  },
};

// ─── Activity Log Service ─────────────────────────────────────────────────────

export const activityLogService = {
  async create(data: Omit<ActivityLog, "id" | "timestamp">): Promise<void> {
    await addDoc(collection(getDb(), COLLECTIONS.ACTIVITY_LOGS), {
      ...data,
      timestamp: serverTimestamp(),
    });
  },

  async getAll(limitCount = 50): Promise<ActivityLog[]> {
    return queryDocuments<ActivityLog>(COLLECTIONS.ACTIVITY_LOGS, [
      orderBy("timestamp", "desc"),
      limit(limitCount),
    ]);
  },
};

// ─── Booked slots (conflict lock) ─────────────────────────────────────────────

export const bookedSlotService = {
  async getForDate(
    date: string,
    durationMinutes?: number,
  ): Promise<Array<{ startTime: string; endTime: string }>> {
    const slots = await queryDocuments<BookedSlot>(COLLECTIONS.BOOKED_SLOTS, [
      where("date", "==", date),
    ]);
    const duration =
      durationMinutes ?? mergeScheduleConfig(null).slotDurationMinutes;
    return slots
      .filter((s) => typeof s.startTime === "string" && s.startTime.length > 0)
      .map((s) => ({
        startTime: s.startTime,
        endTime: s.endTime || computeEndTime(s.startTime, duration),
      }));
  },

  async release(date: string, startTime: string): Promise<void> {
    const id = slotDocId(date, startTime);
    const ref = doc(getDb(), COLLECTIONS.BOOKED_SLOTS, id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await deleteDoc(ref);
    }
  },
};

// ─── Schedule Config ──────────────────────────────────────────────────────────

export const scheduleService = {
  async get(): Promise<ScheduleConfig | null> {
    const stored = await getDocument<ScheduleConfig>(
      COLLECTIONS.SCHEDULE_CONFIG,
      "default",
    );
    return stored ? mergeScheduleConfig(stored) : null;
  },

  async getOrDefault(): Promise<ScheduleConfig> {
    return mergeScheduleConfig(await scheduleService.get());
  },

  async ensureDefault(): Promise<ScheduleConfig> {
    const existing = await getDocument<ScheduleConfig>(
      COLLECTIONS.SCHEDULE_CONFIG,
      "default",
    );
    if (existing) return mergeScheduleConfig(existing);
    const ref = doc(getDb(), COLLECTIONS.SCHEDULE_CONFIG, "default");
    const config = {
      id: "default",
      ...DEFAULT_SCHEDULE_CONFIG,
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, config);
    return mergeScheduleConfig(config as ScheduleConfig);
  },

  async update(data: Partial<ScheduleConfig>): Promise<void> {
    const ref = doc(getDb(), COLLECTIONS.SCHEDULE_CONFIG, "default");
    await setDoc(
      ref,
      { ...data, updatedAt: serverTimestamp() },
      { merge: true },
    );
  },

  async generateAvailableSlots(
    date: string,
  ): Promise<Array<{ time: string; available: boolean }>> {
    let config = mergeScheduleConfig(null);
    let lockedSlots: Array<{ startTime: string; endTime: string }> = [];

    if (!isFirebaseConfigured) {
      return getAvailableSlotsForDate(config, date, lockedSlots);
    }

    try {
      config = await scheduleService.getOrDefault();
    } catch (err) {
      console.warn("schedule_config unavailable, using defaults", err);
    }

    try {
      lockedSlots = await bookedSlotService.getForDate(date);
    } catch (err) {
      console.warn("booked_slots unavailable, showing all generated slots", err);
    }

    const slots = getAvailableSlotsForDate(config, date, lockedSlots);
    const openCount = slots.filter((s) => s.available).length;
    if (openCount === 0 && slots.length === 0) {
      return getAvailableSlotsForDate(mergeScheduleConfig(null), date, lockedSlots);
    }
    return slots;
  },
};

// ─── Analytics / Dashboard Stats ─────────────────────────────────────────────

export const statsService = {
  async getDashboardStats() {
    const [leads, appointments, companies, subscribers] = await Promise.all([
      queryDocuments<Lead>(COLLECTIONS.LEADS, [
        where("isArchived", "==", false),
      ]),
      queryDocuments<Appointment>(COLLECTIONS.APPOINTMENTS, []),
      queryDocuments<Company>(COLLECTIONS.COMPANIES, []),
      queryDocuments<NewsletterSubscriber>(COLLECTIONS.NEWSLETTER, [
        where("isActive", "==", true),
      ]),
    ]);

    const leadsByStatus = leads.reduce(
      (acc, l) => {
        acc[l.status] = (acc[l.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const appointmentsByStatus = appointments.reduce(
      (acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const conversionRate =
      leads.length > 0
        ? Math.round(((leadsByStatus["converted"] || 0) / leads.length) * 100)
        : 0;

    const planInquiries = leads.filter(
      (l) => l.source === "pricing_selection",
    ).length;

    const sortedLeads = [...leads].sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() ?? 0;
      const bTime = b.createdAt?.toMillis?.() ?? 0;
      return bTime - aTime;
    });

    return {
      totalLeads: leads.length,
      newLeads: leadsByStatus["new"] || 0,
      convertedLeads: leadsByStatus["converted"] || 0,
      demoScheduled: leadsByStatus["demo_scheduled"] || 0,
      conversionRate,
      totalAppointments: appointments.length,
      pendingAppointments: appointmentsByStatus["pending"] || 0,
      confirmedAppointments: appointmentsByStatus["confirmed"] || 0,
      totalCompanies: companies.length,
      newsletterSubscribers: subscribers.length,
      planInquiries,
      recentLeads: sortedLeads.slice(0, 5),
    };
  },
};
