import type { BillingTerm, PlanTier } from "@/types/types";

export const TIER_BASE_ETB: Record<Exclude<PlanTier, "hybrid">, number> = {
  entry: 800,
  professional: 1500,
  full: 2400,
};

export const TERM_MULTIPLIERS: Record<
  BillingTerm,
  { mult: number; saveLabel: string }
> = {
  3: { mult: 3, saveLabel: "" },
  6: { mult: 6 * 0.9, saveLabel: "Save 10%" },
  12: { mult: 12 * 0.8, saveLabel: "Save 20%" },
};

export interface PlanQuote {
  monthlyEtb: number | null;
  totalEtb: number | null;
}

export function calculatePlanQuote(
  tier: PlanTier,
  term: BillingTerm,
  baseEtbOverride?: number | null,
): PlanQuote {
  if (tier === "hybrid") {
    return { monthlyEtb: null, totalEtb: null };
  }
  const base =
    baseEtbOverride != null && baseEtbOverride > 0
      ? baseEtbOverride
      : TIER_BASE_ETB[tier];
  const total = Math.round(base * TERM_MULTIPLIERS[term].mult);
  const monthly = Math.round(total / term);
  return { monthlyEtb: monthly, totalEtb: total };
}

export function getTermMultiplier(term: BillingTerm): number {
  return TERM_MULTIPLIERS[term].mult;
}
