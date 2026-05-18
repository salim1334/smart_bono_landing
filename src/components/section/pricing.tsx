import { Check } from "lucide-react";
import { motion } from "motion/react";

type Term = 3 | 6 | 12;

const termLabels: Record<Term, { label: string; save: string; mult: number }> = {
  3: { label: "3 months", save: "", mult: 3 },
  6: { label: "6 months", save: "Save 10%", mult: 6 * 0.9 },
  12: { label: "12 months", save: "Save 20%", mult: 12 * 0.8 },
};

const tiers = [
  {
    name: "Entry",
    am: "መነሻ",
    tagline: "Essential offline printing",
    base: 800,
    features: [
      "Offline-first POS",
      "Mobile thermal printing",
      "Menu & order taking",
      "Daily sales summary",
      "Amharic + English UI",
    ],
    accent: "from-[oklch(0.78_0.16_75)] to-[oklch(0.7_0.14_70)]",
  },
  {
    name: "Professional",
    am: "ፕሮፌሽናል",
    tagline: "Adds cashflow management",
    base: 1500,
    popular: true,
    features: [
      "Everything in Entry",
      "Cashflow & expense tracking",
      "Cashier shift reports",
      "Grouped order reports",
      "Multi-payment methods",
      "Receipt customisation",
    ],
    accent: "from-[oklch(0.5_0.08_195)] to-[oklch(0.4_0.07_200)]",
  },
  {
    name: "Full",
    am: "ሙሉ",
    tagline: "Ingredients & inventory",
    base: 2400,
    features: [
      "Everything in Professional",
      "Ingredient & recipe tracking",
      "Low-stock alerts",
      "Supplier management",
      "Advanced analytics & charts",
    ],
    accent: "from-[oklch(0.45_0.16_25)] to-[oklch(0.35_0.14_25)]",
  },
  {
    name: "Hybrid",
    am: "ሃይብሪድ",
    tagline: "Enterprise multi-device sync",
    base: null,
    features: [
      "Everything in Full",
      "Waiter · Kitchen · Cashier sync",
      "Cloud dashboard for owners",
      "Real-time remote analytics",
      "Multi-branch ready",
      "Priority onboarding",
    ],
    accent: "from-[oklch(0.35_0.08_45)] to-[oklch(0.22_0.04_40)]",
    enterprise: true,
  },
];

export function Pricing({ term, setTerm }: { term: Term; setTerm: (t: Term) => void }) {
  return (
    <section id="pricing" className="bg-cream border-y border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[oklch(0.5_0.08_195)]">
            Pricing
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-ink">
            Pick a plan. Save on longer terms.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Transparent pricing in Ethiopian Birr. Commit longer, save more.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center rounded-full bg-background border border-border p-1 shadow-soft">
            {([3, 6, 12] as Term[]).map((t) => (
              <button
                key={t}
                onClick={() => setTerm(t)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition ${
                  term === t ? "bg-ink text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {termLabels[t].label}
                {termLabels[t].save && (
                  <span className={`ml-2 text-[10px] font-bold ${term === t ? "text-[oklch(0.78_0.16_75)]" : "text-[oklch(0.45_0.16_25)]"}`}>
                    {termLabels[t].save}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const total = tier.base ? Math.round(tier.base * termLabels[term].mult) : null;
            const perMonth = total ? Math.round(total / term) : null;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative rounded-3xl border bg-card p-7 flex flex-col ${
                  tier.popular ? "border-[oklch(0.5_0.08_195)] shadow-glow" : "border-border shadow-soft"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[oklch(0.78_0.16_75)] text-ink text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                    Most popular
                  </div>
                )}
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${tier.accent} mb-4`} />
                <div className="flex items-baseline gap-2">
                  <h3 className="font-display text-2xl font-bold">{tier.name}</h3>
                  <span className="text-sm text-muted-foreground">{tier.am}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{tier.tagline}</p>

                <div className="mt-6 pb-6 border-b border-border min-h-[96px]">
                  {tier.enterprise ? (
                    <>
                      <div className="font-display text-3xl font-bold text-ink">Custom</div>
                      <div className="text-xs text-muted-foreground mt-1">Talk to sales</div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-4xl font-bold text-ink">{perMonth?.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">ብር / mo</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {total?.toLocaleString()} ብር billed every {term} months
                      </div>
                    </>
                  )}
                </div>

                <ul className="mt-6 space-y-3 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm">
                      <Check className="h-4 w-4 text-[oklch(0.5_0.08_195)] shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`mt-8 w-full rounded-full py-3 text-sm font-semibold transition ${
                    tier.popular
                      ? "gradient-burgundy text-background hover:opacity-95"
                      : tier.enterprise
                      ? "bg-ink text-background hover:opacity-90"
                      : "bg-background border border-border hover:bg-muted text-foreground"
                  }`}
                >
                  {tier.enterprise ? "Contact sales" : "Choose " + tier.name}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}