import type { BillingTerm, PlanTier } from "@/types/types";

export const TIER_BASE_ETB: Record<Exclude<PlanTier, "hybrid">, number> = {
  entry: 2500,
  professional: 3167,
  full: 5000,
};

/** Explicit per-tier, per-term monthly prices (ETB/mo). */
export const TIER_PRICES_ETB: Record<PlanTier, Record<BillingTerm, number>> = {
  entry:        { 3: 2500, 6: 1667, 12: 1250 },
  professional: { 3: 3167, 6: 2333, 12: 1667 },
  full:         { 3: 5000, 6: 4167, 12: 2917 },
  hybrid:       { 3: 6000, 6: 5833, 12: 3750 },
};

export const TERM_MULTIPLIERS: Record<
  BillingTerm,
  { mult: number; saveLabel: string }
> = {
  3:  { mult: 3,        saveLabel: "" },
  6:  { mult: 6 * 0.7,  saveLabel: "Save up to 33%" },
  12: { mult: 12 * 0.5, saveLabel: "Save up to 50%" },
};

export interface PlanQuote {
  monthlyEtb: number | null;
  totalEtb: number | null;
}

export function calculatePlanQuote(
  tier: PlanTier,
  term: BillingTerm,
  baseEtbOverride?: number | null,
  pricesOverride?: Partial<Record<BillingTerm, number>> | null,
): PlanQuote {
  // Explicit per-term price takes highest priority.
  const explicitMonthly = pricesOverride?.[term];
  if (explicitMonthly != null) {
    return {
      monthlyEtb: explicitMonthly,
      totalEtb: Math.round(explicitMonthly * term),
    };
  }
  if (tier === "hybrid") {
    return { monthlyEtb: null, totalEtb: null };
  }
  const base =
    baseEtbOverride != null && baseEtbOverride > 0
      ? baseEtbOverride
      : TIER_BASE_ETB[tier as Exclude<PlanTier, "hybrid">];
  const total = Math.round(base * TERM_MULTIPLIERS[term].mult);
  const monthly = Math.round(total / term);
  return { monthlyEtb: monthly, totalEtb: total };
}

export function getTermMultiplier(term: BillingTerm): number {
  return TERM_MULTIPLIERS[term].mult;
}
