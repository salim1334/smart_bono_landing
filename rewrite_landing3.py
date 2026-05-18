import re

with open("src/components/landing/Landing.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# Pricing
pr_def = """function Pricing({ term, setTerm, t }: { term: Term; setTerm: (t: Term) => void; t: any }) {
  const termLabels: Record<Term, { label: string; save: string; mult: number }> = {
    3: { label: t.months[0], save: t.save[0], mult: 3 },
    6: { label: t.months[1], save: t.save[1], mult: 6 * 0.9 },
    12: { label: t.months[2], save: t.save[2], mult: 12 * 0.8 },
  };

  const dynamicTiers = [
    {
      name: t.tiersLabel.Entry, am: t.tiersAm.Entry, tagline: t.tiersTag.Entry, base: 800,
      features: t.tiersFeat.Entry, accent: "from-[oklch(0.78_0.16_75)] to-[oklch(0.7_0.14_70)]",
    },
    {
      name: t.tiersLabel.Professional, am: t.tiersAm.Professional, tagline: t.tiersTag.Professional, base: 1500, popular: true,
      features: t.tiersFeat.Professional, accent: "from-[oklch(0.5_0.08_195)] to-[oklch(0.4_0.07_200)]",
    },
    {
      name: t.tiersLabel.Full, am: t.tiersAm.Full, tagline: t.tiersTag.Full, base: 2400,
      features: t.tiersFeat.Full, accent: "from-[oklch(0.45_0.16_25)] to-[oklch(0.35_0.14_25)]",
    },
    {
      name: t.tiersLabel.Hybrid, am: t.tiersAm.Hybrid, tagline: t.tiersTag.Hybrid, base: null, enterprise: true,
      features: t.tiersFeat.Hybrid, accent: "from-[oklch(0.35_0.08_45)] to-[oklch(0.22_0.04_40)]",
    },
  ];

  return (
    <section id="pricing" className="bg-cream border-y border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[oklch(0.5_0.08_195)]">
            {t.badge}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-ink">
            {t.title}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t.sub}
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center rounded-full bg-background border border-border p-1 shadow-soft">
            {([3, 6, 12] as Term[]).map((iter) => (
              <button
                key={iter}
                onClick={() => setTerm(iter)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition ${
                  term === iter ? "bg-ink text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {termLabels[iter].label}
                {termLabels[iter].save && (
                  <span className={`ml-2 text-[10px] font-bold ${term === iter ? "text-[oklch(0.78_0.16_75)]" : "text-[oklch(0.45_0.16_25)]"}`}>
                    {termLabels[iter].save}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dynamicTiers.map((tier) => {
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
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[oklch(0.78_0.16_75)] text-ink text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full whitespace-nowrap">
                    {t.popular}
                  </div>
                )}
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${tier.accent} mb-4`} />
                <div className="flex items-baseline gap-2">
                  <h3 className="font-display text-2xl font-bold">{tier.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{tier.tagline}</p>

                <div className="mt-6 pb-6 border-b border-border min-h-[96px]">
                  {tier.enterprise ? (
                    <>
                      <div className="font-display text-3xl font-bold text-ink">{t.custom}</div>
                      <div className="text-xs text-muted-foreground mt-1">{t.talkSales}</div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-4xl font-bold text-ink">{perMonth?.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">{t.monthlbl}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {total?.toLocaleString()} {t.billed} {term}
                      </div>
                    </>
                  )}
                </div>

                <ul className="mt-6 space-y-3 flex-1">
                  {tier.features.map((f: string, i: number) => (
                    <li key={i} className="flex gap-2.5 text-sm">
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
                  {tier.enterprise ? t.contact : t.choose + " " + tier.name}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}"""
code = re.sub(r'function Pricing\(\{ term, setTerm \}: \{ term: Term; setTerm: \(t: Term\) => void \}\) \{[\s\S]*?    </section>\n  \);\n}', pr_def, code)

# Trust
tr_def = """function Trust({ t }: { t: any }) {
  const items = [
    { icon: ShieldCheck, ...t.items[0] },
    { icon: WifiOff, ...t.items[1] },
    { icon: Languages, ...t.items[2] },
  ];
  return (
    <section id="trust" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it: any, i) => (
          <div key={i} className="rounded-3xl border border-border bg-card p-7 shadow-soft">
            <div className="h-11 w-11 rounded-2xl gradient-teal flex items-center justify-center">
              <it.icon className="h-5 w-5 text-background" />
            </div>
            <h3 className="font-display text-xl font-bold mt-5">{it.t}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{it.s}</p>
          </div>
        ))}
      </div>
    </section>
  );
}"""
code = re.sub(r'function Trust\(\) \{[\s\S]*?    </section>\n  \);\n}', tr_def, code)

# CTA
cta_def = """function CTA({ t }: { t: any }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-[2rem] gradient-burgundy text-background p-12 md:p-16 shadow-glow">
        <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-[oklch(0.78_0.16_75)] opacity-30 blur-3xl" />
        <div className="relative max-w-2xl">
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            {t.title}
          </h2>
          <p className="mt-4 text-background/85 text-lg">
            {t.sub}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-full bg-background text-ink px-6 py-3.5 text-sm font-semibold hover:opacity-90 transition"
            >
              {t.pricing} <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="mailto:hello@alarmtech.et"
              className="inline-flex items-center gap-2 rounded-full border border-background/30 px-6 py-3.5 text-sm font-semibold hover:bg-background/10 transition"
            >
              {t.sales}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}"""
code = re.sub(r'function CTA\(\) \{[\s\S]*?    </section>\n  \);\n}', cta_def, code)

# Footer
footer_def = """function Footer({ t }: { t: any }) {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="" className="h-7 w-7 object-contain" />
          <span className="font-display font-bold text-foreground">Smart ቦኖ</span>
          <span>· {t.by}</span>
        </div>
        <div>© {new Date().getFullYear()} Alarm Technology. {t.city}</div>
      </div>
    </footer>
  );
}"""
code = re.sub(r'function Footer\(\) \{[\s\S]*?    </footer>\n  \);\n}', footer_def, code)

with open("src/components/landing/Landing.tsx", "w", encoding="utf-8") as f:
    f.write(code)

