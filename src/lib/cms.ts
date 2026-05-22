import type {
  ContentItem,
  PricingSectionContent,
  PricingTierContent,
  SiteBannerContent,
} from "@/types/types";

export function parseContentBody<T>(body: string | undefined): T | null {
  if (!body) return null;
  try {
    return JSON.parse(body) as T;
  } catch {
    return null;
  }
}

export function serializeContentBody<T>(data: T): string {
  return JSON.stringify(data);
}

export function contentToSection(item: ContentItem | null): PricingSectionContent | null {
  return parseContentBody<PricingSectionContent>(item?.body);
}

export function contentToTier(item: ContentItem | null): PricingTierContent | null {
  return parseContentBody<PricingTierContent>(item?.body);
}

export function contentToBanner(item: ContentItem | null): SiteBannerContent | null {
  return parseContentBody<SiteBannerContent>(item?.body);
}

export const PRICING_SECTION_KEY = "pricing_section";
export const PROMO_BANNER_KEY = "promo_banner";

export function pricingTierKey(tierId: string): string {
  return `pricing_tier_${tierId}`;
}

export const PLAN_TIER_ORDER: Array<PricingTierContent["tierId"]> = [
  "entry",
  "professional",
  "full",
  "hybrid",
];

export function isBannerScheduled(
  content: SiteBannerContent,
  now = new Date(),
): boolean {
  const start = content.startsAt ? new Date(content.startsAt) : null;
  const end = content.endsAt ? new Date(content.endsAt) : null;
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}
