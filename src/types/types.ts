import { Timestamp } from "firebase/firestore";

// ─── User / Auth ───────────────────────────────────────────────────────────

export type UserRole = "user" | "admin" | "super_admin";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  phone?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  onboardingCompleted: boolean;
  onboardingStep: number;
  companyId?: string;
  notificationPreferences: {
    email: boolean;
    marketing: boolean;
    bookingReminders: boolean;
    onboardingReminders: boolean;
  };
}

// ─── Company / Onboarding ──────────────────────────────────────────────────

export type BusinessType =
  | "cafe"
  | "restaurant"
  | "hotel_restaurant"
  | "fast_food"
  | "cafeteria"
  | "bakery"
  | "other";

export type BusinessSize = "1-5" | "6-20" | "21-50" | "50+";

export interface Company {
  id: string;
  name: string;
  ownerId: string;
  businessType: BusinessType;
  businessSize: BusinessSize;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  numberOfBranches: number;
  currentSystem?: string;
  painPoints?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  onboardingChecklist: OnboardingChecklist;
  tier?: PlanTier;
  trialEndsAt?: Timestamp;
  isActive: boolean;
}

export interface OnboardingChecklist {
  profileCompleted: boolean;
  demoBooked: boolean;
  demoCompleted: boolean;
  firstReceiptPrinted: boolean;
  staffAdded: boolean;
  menuConfigured: boolean;
}

// ─── Pricing / Plans ───────────────────────────────────────────────────────

export type PlanTier = "entry" | "professional" | "full" | "hybrid";
export type BillingTerm = 3 | 6 | 12;

// ─── Lead ──────────────────────────────────────────────────────────────────

export type LeadStatus =
  | "new"
  | "contacted"
  | "interested"
  | "demo_scheduled"
  | "follow_up_needed"
  | "converted"
  | "lost"
  | "spam";

export type LeadSource =
  | "landing_page"
  | "demo_booking"
  | "pricing_selection"
  | "contact_form"
  | "whatsapp"
  | "telegram"
  | "referral"
  | "google_ads"
  | "organic"
  | "social"
  | "other";

export type PreferredContact = "phone" | "email" | "telegram" | "whatsapp";

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  businessName?: string;
  businessType?: BusinessType;
  businessSize?: BusinessSize;
  city?: string;
  source: LeadSource;
  status: LeadStatus;
  preferredContact?: PreferredContact;
  notes?: string;
  adminNotes?: string;
  tags: string[];
  assignedTo?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastContactedAt?: Timestamp;
  convertedAt?: Timestamp;
  companyId?: string;
  userId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  isArchived: boolean;
  interestedTier?: PlanTier;
  billingTermMonths?: BillingTerm;
  quotedMonthlyEtb?: number;
  quotedTotalEtb?: number;
}

// ─── Demo Booking / Appointment ─────────────────────────────────────────────

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "rescheduled"
  | "completed"
  | "no_show";

export type DemoType = "online" | "in_person" | "phone_call";

export interface TimeSlot {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  startTime: string; // "09:00"
  endTime: string; // "09:30"
  isAvailable: boolean;
  bookedBy?: string;
}

export interface Appointment {
  id: string;
  leadId?: string;
  userId?: string;
  name: string;
  email?: string;
  phone: string;
  businessName?: string;
  businessType?: BusinessType;
  businessSize?: BusinessSize;
  demoType: DemoType;
  preferredContact: PreferredContact;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  adminNotes?: string;
  meetingLink?: string;
  assignedAdmin?: string;
  outcome?: string;
  cancelReason?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  reminderSentAt?: Timestamp;
}

// ─── Content (CMS) ──────────────────────────────────────────────────────────

export type ContentType =
  | "hero"
  | "faq"
  | "testimonial"
  | "pricing"
  | "site_banner"
  | "feature"
  | "blog_post"
  | "page_meta";

export type SiteBannerVariant = "info" | "promo" | "warning";

export interface PricingSectionContent {
  badgeEn: string;
  badgeAm: string;
  titleEn: string;
  titleAm: string;
  subEn: string;
  subAm: string;
  monthsEn: string[];
  monthsAm: string[];
  saveEn: string[];
  saveAm: string[];
  popularEn: string;
  popularAm: string;
  customEn: string;
  customAm: string;
  talkSalesEn: string;
  talkSalesAm: string;
  monthlblEn: string;
  monthlblAm: string;
  billedEn: string;
  billedAm: string;
  contactEn: string;
  contactAm: string;
  chooseEn: string;
  chooseAm: string;
}

export interface PricingTierContent {
  tierId: PlanTier;
  order: number;
  baseEtb: number | null;
  popular: boolean;
  enterprise: boolean;
  nameEn: string;
  nameAm: string;
  taglineEn: string;
  taglineAm: string;
  featuresEn: string[];
  featuresAm: string[];
}

export interface SiteBannerContent {
  titleEn: string;
  titleAm: string;
  messageEn: string;
  messageAm: string;
  ctaLabelEn?: string;
  ctaLabelAm?: string;
  ctaUrl?: string;
  variant: SiteBannerVariant;
  startsAt: string | null;
  endsAt: string | null;
  dismissible: boolean;
}

export interface PricingSectionUI {
  badge: string;
  title: string;
  sub: string;
  months: string[];
  save: string[];
  popular: string;
  custom: string;
  talkSales: string;
  monthlbl: string;
  billed: string;
  contact: string;
  choose: string;
}

export interface PricingTierUI {
  tierId: PlanTier;
  name: string;
  tagline: string;
  baseEtb: number | null;
  popular?: boolean;
  enterprise?: boolean;
  features: string[];
}

export interface PricingConfigUI {
  section: PricingSectionUI;
  tiers: PricingTierUI[];
}

export interface ActiveSiteBanner {
  content: SiteBannerContent;
  dismissKey: string;
  isPublished: boolean;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  key: string;
  title?: string;
  body?: string;
  imageUrl?: string;
  order?: number;
  isPublished: boolean;
  metadata?: Record<string, string | number | boolean>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  updatedBy: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  businessName: string;
  businessType: BusinessType;
  city: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  photoUrl?: string;
  logoUrl?: string;
  isPublished: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FAQ {
  id: string;
  question: string;
  questionAm?: string;
  answer: string;
  answerAm?: string;
  category: string;
  order: number;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Newsletter / Contact Form ───────────────────────────────────────────────

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  source: LeadSource;
  isActive: boolean;
  subscribedAt: Timestamp;
  unsubscribedAt?: Timestamp;
}

export interface ContactFormSubmission {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  type: "general" | "callback" | "quotation" | "pre_sales" | "support";
  source: LeadSource;
  status: "new" | "read" | "responded";
  createdAt: Timestamp;
  respondedAt?: Timestamp;
}

// ─── Admin Activity Log ──────────────────────────────────────────────────────

export interface ActivityLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  resourceType:
    | "lead"
    | "appointment"
    | "content"
    | "user"
    | "company"
    | "system";
  resourceId?: string;
  details?: Record<string, unknown>;
  timestamp: Timestamp;
  ipAddress?: string;
}

// ─── Available Time Slots Config ─────────────────────────────────────────────

export interface ScheduleConfig {
  id: string;
  workingDays: number[]; // 0=Sunday, 1=Monday, ...
  startHour: number; // 9
  endHour: number; // 17
  breakStartHour?: number; // 12
  breakEndHour?: number; // 13
  slotDurationMinutes: number; // 30
  bufferMinutes: number; // 10 between bookings
  maxBookingsPerDay: number;
  daysAhead: number; // how many bookable dates to show
  blockedDates: string[]; // ["2025-01-01"]
  timezone: string; // "Africa/Addis_Ababa"
  updatedAt: Timestamp;
}

export interface BookedSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  appointmentId: string;
  createdAt: Timestamp;
}
