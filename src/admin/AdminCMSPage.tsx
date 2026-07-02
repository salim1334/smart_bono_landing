import { useEffect, useState } from "react";
import { Loader2, Save, FileText, Megaphone } from "lucide-react";
import { AdminLayout, AdminTopBar } from "@/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { contentService } from "@/lib/firestore";
import { PLAN_TIER_ORDER } from "@/lib/cms";
import {
  getDefaultPricingSectionContent,
  getDefaultPricingTierContent,
  getDefaultSiteBannerContent,
} from "@/lib/cms-defaults";
import type {
  PlanTier,
  PricingSectionContent,
  PricingTierContent,
  SiteBannerContent,
  SiteBannerVariant,
} from "@/lib/types";

type Tab = "pricing" | "banner";

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(value: string): string | null {
  if (!value.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function featuresToText(lines: string[]): string {
  return lines.join("\n");
}

function textToFeatures(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

const TIER_LABELS: Record<PlanTier, string> = {
  entry: "Offline Normal",
  professional: "Offline Advanced",
  full: "Hybrid (Without FB)",
  hybrid: "Hybrid (With FB)",
};

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const className =
    "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
  return (
    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      {label}
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
      )}
    </label>
  );
}

export function AdminCMSPage() {
  const { profile } = useAuth();
  const [tab, setTab] = useState<Tab>("pricing");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [section, setSection] = useState<PricingSectionContent>(
    getDefaultPricingSectionContent(),
  );
  const [tiers, setTiers] = useState<Record<PlanTier, PricingTierContent>>(
    () =>
      Object.fromEntries(
        PLAN_TIER_ORDER.map((id) => [id, getDefaultPricingTierContent(id)]),
      ) as Record<PlanTier, PricingTierContent>,
  );
  const [banner, setBanner] = useState<SiteBannerContent>(
    getDefaultSiteBannerContent(),
  );
  const [sectionPublished, setSectionPublished] = useState(true);
  const [tiersPublished, setTiersPublished] = useState<
    Record<PlanTier, boolean>
  >(
    () =>
      Object.fromEntries(PLAN_TIER_ORDER.map((id) => [id, true])) as Record<
        PlanTier,
        boolean
      >,
  );
  const [bannerPublished, setBannerPublished] = useState(false);

  useEffect(() => {
    if (!profile?.uid) return;
    setLoading(true);
    void contentService
      .ensurePricingDefaults(profile.uid)
      .then(() => contentService.loadPricingForAdmin())
      .then((data) => {
        setSection(data.section);
        setTiers(data.tiers);
        setBanner(data.banner);
        setSectionPublished(data.sectionPublished);
        setTiersPublished(data.tiersPublished);
        setBannerPublished(data.bannerPublished);
      })
      .finally(() => setLoading(false));
  }, [profile?.uid]);

  const updateTier = (tierId: PlanTier, patch: Partial<PricingTierContent>) => {
    setTiers((prev) => ({
      ...prev,
      [tierId]: { ...prev[tierId], ...patch },
    }));
  };

  const saveSection = async () => {
    if (!profile?.uid) return;
    setSaving(true);
    setMessage("");
    try {
      await contentService.savePricingSection(
        section,
        profile.uid,
        sectionPublished,
      );
      setMessage("Pricing section saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const saveTier = async (tierId: PlanTier) => {
    if (!profile?.uid) return;
    setSaving(true);
    setMessage("");
    try {
      await contentService.savePricingTier(
        tierId,
        tiers[tierId],
        profile.uid,
        tiersPublished[tierId],
      );
      setMessage(`${TIER_LABELS[tierId]} tier saved.`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const saveBanner = async () => {
    if (!profile?.uid) return;
    setSaving(true);
    setMessage("");
    try {
      await contentService.saveSiteBanner(
        banner,
        profile.uid,
        bannerPublished,
      );
      setMessage("Site banner saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const resetSection = () => setSection(getDefaultPricingSectionContent());
  const resetTier = (tierId: PlanTier) =>
    updateTier(tierId, getDefaultPricingTierContent(tierId));
  const resetBanner = () => setBanner(getDefaultSiteBannerContent());

  return (
    <AdminLayout>
      <AdminTopBar
        title="CMS"
        subtitle="Manage bilingual pricing and scheduled promo banner"
      />

      <div className="px-8 py-8">
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setTab("pricing")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              tab === "pricing"
                ? "gradient-burgundy text-background"
                : "border border-border hover:bg-muted"
            }`}
          >
            <FileText className="h-4 w-4" /> Pricing
          </button>
          <button
            type="button"
            onClick={() => setTab("banner")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              tab === "banner"
                ? "gradient-burgundy text-background"
                : "border border-border hover:bg-muted"
            }`}
          >
            <Megaphone className="h-4 w-4" /> Site Banner
          </button>
        </div>

        {message && (
          <p className="mb-4 text-sm text-[oklch(0.5_0.08_195)] font-medium">
            {message}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : tab === "pricing" ? (
          <div className="space-y-8 max-w-4xl">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-ink">
                  Section copy
                </h2>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={sectionPublished}
                    onChange={(e) => setSectionPublished(e.target.checked)}
                  />
                  Published
                </label>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="Badge (EN)"
                  value={section.badgeEn}
                  onChange={(v) => setSection({ ...section, badgeEn: v })}
                />
                <Field
                  label="Badge (AM)"
                  value={section.badgeAm}
                  onChange={(v) => setSection({ ...section, badgeAm: v })}
                />
                <Field
                  label="Title (EN)"
                  value={section.titleEn}
                  onChange={(v) => setSection({ ...section, titleEn: v })}
                />
                <Field
                  label="Title (AM)"
                  value={section.titleAm}
                  onChange={(v) => setSection({ ...section, titleAm: v })}
                />
                <Field
                  label="Subtitle (EN)"
                  value={section.subEn}
                  onChange={(v) => setSection({ ...section, subEn: v })}
                  multiline
                />
                <Field
                  label="Subtitle (AM)"
                  value={section.subAm}
                  onChange={(v) => setSection({ ...section, subAm: v })}
                  multiline
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Term labels: comma-separated 3 values (3 / 6 / 12 months) and save
                labels for EN and AM fields below.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="Months EN (comma-separated)"
                  value={section.monthsEn.join(", ")}
                  onChange={(v) =>
                    setSection({
                      ...section,
                      monthsEn: v.split(",").map((s) => s.trim()),
                    })
                  }
                />
                <Field
                  label="Months AM (comma-separated)"
                  value={section.monthsAm.join(", ")}
                  onChange={(v) =>
                    setSection({
                      ...section,
                      monthsAm: v.split(",").map((s) => s.trim()),
                    })
                  }
                />
                <Field
                  label="Save labels EN (comma-separated)"
                  value={section.saveEn.join(", ")}
                  onChange={(v) =>
                    setSection({
                      ...section,
                      saveEn: v.split(",").map((s) => s.trim()),
                    })
                  }
                />
                <Field
                  label="Save labels AM (comma-separated)"
                  value={section.saveAm.join(", ")}
                  onChange={(v) =>
                    setSection({
                      ...section,
                      saveAm: v.split(",").map((s) => s.trim()),
                    })
                  }
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveSection}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl gradient-burgundy text-background px-4 py-2 text-sm font-semibold disabled:opacity-60"
                >
                  <Save className="h-4 w-4" /> Save section
                </button>
                <button
                  type="button"
                  onClick={resetSection}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                >
                  Reset defaults
                </button>
              </div>
            </div>

            {PLAN_TIER_ORDER.map((tierId) => {
              const tier = tiers[tierId];
              return (
                <div
                  key={tierId}
                  className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-bold text-ink">
                      {TIER_LABELS[tierId]}
                    </h2>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={tiersPublished[tierId]}
                        onChange={(e) =>
                          setTiersPublished((p) => ({
                            ...p,
                            [tierId]: e.target.checked,
                          }))
                        }
                      />
                      Published
                    </label>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-2 text-sm pt-1">
                      <input
                        type="checkbox"
                        checked={tier.popular}
                        onChange={(e) =>
                          updateTier(tierId, { popular: e.target.checked })
                        }
                      />
                      Most popular
                    </label>
                    <label className="flex items-center gap-2 text-sm pt-1">
                      <input
                        type="checkbox"
                        checked={tier.enterprise}
                        onChange={(e) =>
                          updateTier(tierId, {
                            enterprise: e.target.checked,
                            pricesEtb: e.target.checked ? null : tier.pricesEtb,
                            baseEtb: e.target.checked ? null : tier.baseEtb,
                          })
                        }
                      />
                      Custom pricing (no price shown)
                    </label>
                  </div>
                  {!tier.enterprise && (
                    <div className="grid sm:grid-cols-3 gap-4">
                      {([3, 6, 12] as const).map((term) => (
                        <label
                          key={term}
                          className="text-xs font-semibold text-muted-foreground uppercase"
                        >
                          {term}-month price (ETB/mo)
                          <input
                            type="number"
                            value={tier.pricesEtb?.[term] ?? ""}
                            onChange={(e) => {
                              const val = e.target.value
                                ? Number(e.target.value)
                                : undefined;
                              const current = tier.pricesEtb ?? {
                                3: 0,
                                6: 0,
                                12: 0,
                              };
                              updateTier(tierId, {
                                pricesEtb: { ...current, [term]: val ?? 0 },
                                ...(term === 3 ? { baseEtb: val ?? null } : {}),
                              });
                            }}
                            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                          />
                        </label>
                      ))}
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field
                      label="Name (EN)"
                      value={tier.nameEn}
                      onChange={(v) => updateTier(tierId, { nameEn: v })}
                    />
                    <Field
                      label="Name (AM)"
                      value={tier.nameAm}
                      onChange={(v) => updateTier(tierId, { nameAm: v })}
                    />
                    <Field
                      label="Tagline (EN)"
                      value={tier.taglineEn}
                      onChange={(v) => updateTier(tierId, { taglineEn: v })}
                    />
                    <Field
                      label="Tagline (AM)"
                      value={tier.taglineAm}
                      onChange={(v) => updateTier(tierId, { taglineAm: v })}
                    />
                    <Field
                      label="Features (EN, one per line)"
                      value={featuresToText(tier.featuresEn)}
                      onChange={(v) =>
                        updateTier(tierId, { featuresEn: textToFeatures(v) })
                      }
                      multiline
                    />
                    <Field
                      label="Features (AM, one per line)"
                      value={featuresToText(tier.featuresAm)}
                      onChange={(v) =>
                        updateTier(tierId, { featuresAm: textToFeatures(v) })
                      }
                      multiline
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveTier(tierId)}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl gradient-burgundy text-background px-4 py-2 text-sm font-semibold disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" /> Save {TIER_LABELS[tierId]}
                    </button>
                    <button
                      type="button"
                      onClick={() => resetTier(tierId)}
                      className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                    >
                      Reset tier
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="max-w-3xl space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-ink">
                  Promo banner
                </h2>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={bannerPublished}
                    onChange={(e) => setBannerPublished(e.target.checked)}
                  />
                  Published
                </label>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="Title (EN)"
                  value={banner.titleEn}
                  onChange={(v) => setBanner({ ...banner, titleEn: v })}
                />
                <Field
                  label="Title (AM)"
                  value={banner.titleAm}
                  onChange={(v) => setBanner({ ...banner, titleAm: v })}
                />
                <Field
                  label="Message (EN)"
                  value={banner.messageEn}
                  onChange={(v) => setBanner({ ...banner, messageEn: v })}
                  multiline
                />
                <Field
                  label="Message (AM)"
                  value={banner.messageAm}
                  onChange={(v) => setBanner({ ...banner, messageAm: v })}
                  multiline
                />
                <Field
                  label="CTA label (EN)"
                  value={banner.ctaLabelEn ?? ""}
                  onChange={(v) =>
                    setBanner({ ...banner, ctaLabelEn: v || undefined })
                  }
                />
                <Field
                  label="CTA label (AM)"
                  value={banner.ctaLabelAm ?? ""}
                  onChange={(v) =>
                    setBanner({ ...banner, ctaLabelAm: v || undefined })
                  }
                />
                <Field
                  label="CTA URL"
                  value={banner.ctaUrl ?? ""}
                  onChange={(v) =>
                    setBanner({ ...banner, ctaUrl: v || undefined })
                  }
                />
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Variant
                  <select
                    value={banner.variant}
                    onChange={(e) =>
                      setBanner({
                        ...banner,
                        variant: e.target.value as SiteBannerVariant,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="promo">Promo</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                  </select>
                </label>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Starts at (optional)
                  <input
                    type="datetime-local"
                    value={toDatetimeLocal(banner.startsAt)}
                    onChange={(e) =>
                      setBanner({
                        ...banner,
                        startsAt: fromDatetimeLocal(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </label>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Ends at (optional)
                  <input
                    type="datetime-local"
                    value={toDatetimeLocal(banner.endsAt)}
                    onChange={(e) =>
                      setBanner({
                        ...banner,
                        endsAt: fromDatetimeLocal(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm pt-6">
                  <input
                    type="checkbox"
                    checked={banner.dismissible}
                    onChange={(e) =>
                      setBanner({ ...banner, dismissible: e.target.checked })
                    }
                  />
                  User can dismiss
                </label>
              </div>
              <div
                className={`rounded-xl p-4 mt-4 ${
                  banner.variant === "promo"
                    ? "gradient-burgundy text-background"
                    : banner.variant === "warning"
                      ? "bg-[oklch(0.78_0.16_75)] text-ink"
                      : "bg-[oklch(0.5_0.08_195)] text-background"
                }`}
              >
                <p className="font-bold text-sm">{banner.titleEn}</p>
                <p className="text-xs opacity-90 mt-1">{banner.messageEn}</p>
                {banner.ctaLabelEn && (
                  <span className="inline-block mt-2 text-xs font-semibold underline">
                    {banner.ctaLabelEn}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveBanner}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl gradient-burgundy text-background px-4 py-2 text-sm font-semibold disabled:opacity-60"
                >
                  <Save className="h-4 w-4" /> Save banner
                </button>
                <button
                  type="button"
                  onClick={resetBanner}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                >
                  Reset defaults
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
