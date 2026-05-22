import { dictionaries } from "@/locales/dictionaries";
import { TIER_BASE_ETB } from "@/lib/pricing";
import type {
  PlanTier,
  PricingConfigUI,
  PricingSectionContent,
  PricingSectionUI,
  PricingTierContent,
  PricingTierUI,
  SiteBannerContent,
} from "@/types/types";
import type { Language } from "@/locales/dictionaries";

const en = dictionaries.en.pricing;
const am = dictionaries.am.pricing;

const TIER_KEYS: Array<{
  tierId: PlanTier;
  order: number;
  labelKey: keyof typeof en.tiersLabel;
  popular?: boolean;
  enterprise?: boolean;
}> = [
  { tierId: "entry", order: 0, labelKey: "Entry" },
  { tierId: "professional", order: 1, labelKey: "Professional", popular: true },
  { tierId: "full", order: 2, labelKey: "Full" },
  { tierId: "hybrid", order: 3, labelKey: "Hybrid", enterprise: true },
];

export function getDefaultPricingSectionContent(): PricingSectionContent {
  return {
    badgeEn: en.badge,
    badgeAm: am.badge,
    titleEn: en.title,
    titleAm: am.title,
    subEn: en.sub,
    subAm: am.sub,
    monthsEn: [...en.months],
    monthsAm: [...am.months],
    saveEn: [...en.save],
    saveAm: [...am.save],
    popularEn: en.popular,
    popularAm: am.popular,
    customEn: en.custom,
    customAm: am.custom,
    talkSalesEn: en.talkSales,
    talkSalesAm: am.talkSales,
    monthlblEn: en.monthlbl,
    monthlblAm: am.monthlbl,
    billedEn: en.billed,
    billedAm: am.billed,
    contactEn: en.contact,
    contactAm: am.contact,
    chooseEn: en.choose,
    chooseAm: am.choose,
  };
}

export function getDefaultPricingTierContent(
  tierId: PlanTier,
): PricingTierContent {
  const meta = TIER_KEYS.find((t) => t.tierId === tierId)!;
  const labelKey = meta.labelKey;
  const base =
    tierId === "hybrid" ? null : TIER_BASE_ETB[tierId as keyof typeof TIER_BASE_ETB];
  return {
    tierId,
    order: meta.order,
    baseEtb: base,
    popular: !!meta.popular,
    enterprise: !!meta.enterprise,
    nameEn: en.tiersLabel[labelKey],
    nameAm: am.tiersLabel[labelKey],
    taglineEn: en.tiersTag[labelKey],
    taglineAm: am.tiersTag[labelKey],
    featuresEn: [...en.tiersFeat[labelKey]],
    featuresAm: [...am.tiersFeat[labelKey]],
  };
}

export function getAllDefaultPricingTiers(): PricingTierContent[] {
  return TIER_KEYS.map((t) => getDefaultPricingTierContent(t.tierId));
}

export function sectionContentToUI(
  content: PricingSectionContent,
  lang: Language,
): PricingSectionUI {
  const isAm = lang === "am";
  return {
    badge: isAm ? content.badgeAm : content.badgeEn,
    title: isAm ? content.titleAm : content.titleEn,
    sub: isAm ? content.subAm : content.subEn,
    months: isAm ? content.monthsAm : content.monthsEn,
    save: isAm ? content.saveAm : content.saveEn,
    popular: isAm ? content.popularAm : content.popularEn,
    custom: isAm ? content.customAm : content.customEn,
    talkSales: isAm ? content.talkSalesAm : content.talkSalesEn,
    monthlbl: isAm ? content.monthlblAm : content.monthlblEn,
    billed: isAm ? content.billedAm : content.billedEn,
    contact: isAm ? content.contactAm : content.contactEn,
    choose: isAm ? content.chooseAm : content.chooseEn,
  };
}

export function tierContentToUI(
  content: PricingTierContent,
  lang: Language,
): PricingTierUI {
  const isAm = lang === "am";
  return {
    tierId: content.tierId,
    name: isAm ? content.nameAm : content.nameEn,
    tagline: isAm ? content.taglineAm : content.taglineEn,
    baseEtb: content.baseEtb,
    popular: content.popular,
    enterprise: content.enterprise,
    features: isAm ? content.featuresAm : content.featuresEn,
  };
}

export function buildPricingConfigUI(
  section: PricingSectionContent,
  tiers: PricingTierContent[],
  lang: Language,
): PricingConfigUI {
  const sorted = [...tiers].sort((a, b) => a.order - b.order);
  return {
    section: sectionContentToUI(section, lang),
    tiers: sorted.map((t) => tierContentToUI(t, lang)),
  };
}

export function getDefaultPricingConfigUI(lang: Language): PricingConfigUI {
  return buildPricingConfigUI(
    getDefaultPricingSectionContent(),
    getAllDefaultPricingTiers(),
    lang,
  );
}

export function getDefaultSiteBannerContent(): SiteBannerContent {
  return {
    titleEn: "Welcome to Smart bono",
    titleAm: "ወደ ስማርት ቦኖ እንኳን ደህና መጡ",
    messageEn: "Book a free demo and see how Smart bono fits your cafe.",
    messageAm: "ነጻ ዴሞ ያስይዙ እና ስማርት ቦኖ ለካፌዎ እንዴት እንደሚስማማ ይመልከቱ።",
    ctaLabelEn: "Book a demo",
    ctaLabelAm: "ዴሞ ያስይዙ",
    ctaUrl: "#",
    variant: "promo",
    startsAt: null,
    endsAt: null,
    dismissible: true,
  };
}

export function getTierDisplayName(
  tiers: PricingTierUI[],
  tierId: PlanTier,
): string {
  return tiers.find((t) => t.tierId === tierId)?.name ?? tierId;
}
