import re

with open("src/components/landing/Landing.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add definitions and imports
imports = """import { useState } from "react";
import { motion } from "motion/react";
import { Language, dictionaries } from "@/locales/dictionaries";"""

code = re.sub(r'import { useState } from "react";\s*import { motion } from "motion/react";', imports, code)

# 2. Modify Landing component
landing_def = """export function Landing() {
  const [term, setTerm] = useState<Term>(6);
  const [lang, setLang] = useState<Language>("en");
  const t = dictionaries[lang];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav lang={lang} setLang={setLang} t={t.nav} />
      <Hero t={t.hero} />
      <ValuePills t={t.valuePills} />
      <SmartPrinting t={t.smartPrinting} />
      <Hybrid t={t.hybrid} />
      <DailyOperations t={t.dailyOps} />
      <AdminControl t={t.admin} />
      <Pricing term={term} setTerm={setTerm} t={t.pricing} />
      <Trust t={t.trust} />
      <CTA t={t.cta} />
      <Footer t={t.footer} />
      <PhoneMockup className="hidden" />
    </div>
  );
}"""
code = re.sub(r'export function Landing\(\) \{[\s\S]*?    </div>\n  \);\n}', landing_def, code)

# 3. Modify Nav
nav_def = """function Nav({ lang, setLang, t }: { lang: Language, setLang: (l: Language) => void, t: any }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <img src={logo} alt="Smart bono" className="h-9 w-9 object-contain" />
          <span className="font-display text-xl font-bold tracking-tight">
            Smart <span className="text-[oklch(0.5_0.08_195)]">ቦኖ</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#printing" className="hover:text-foreground transition">{t.smartPrinting}</a>
          <a href="#hybrid" className="hover:text-foreground transition">{t.hybrid}</a>
          <a href="#pricing" className="hover:text-foreground transition">{t.pricing}</a>
          <a href="#trust" className="hover:text-foreground transition">{t.trust}</a>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            {lang === 'en' ? 'አማ' : 'EN'}
          </button>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-full bg-ink text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition"
          >
            {t.getStarted} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}"""
code = re.sub(r'function Nav\(\) \{[\s\S]*?    </header>\n  \);\n}', nav_def, code)

# 4. Modify Hero
hero_def = """function Hero({ t }: { t: any }) {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28 md:pb-32 grid lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.5_0.08_195)]" />
            {t.badge}
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.02] text-ink">
            {t.title1}
            <br />
            <span className="italic text-[oklch(0.45_0.16_25)]">{t.title2}</span>
            <br />
            {t.title3}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            {t.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-full gradient-burgundy text-background px-6 py-3.5 text-sm font-semibold shadow-soft hover:opacity-95 transition"
            >
              {t.btnPricing} <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#printing"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold hover:bg-muted transition"
            >
              {t.btnHow}
            </a>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md">
            {[
              { k: "100%", v: t.stats.offline },
              { k: "2", v: t.stats.languages },
              { k: "4", v: t.stats.tiers },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-3xl font-bold text-ink">{s.k}</dt>
                <dd className="text-xs text-muted-foreground mt-1">{s.v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-glow border border-border">
            <img src={phonePrinter} alt="Smart bono on a phone printing a receipt" className="w-full h-auto" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -left-6 top-10 bg-card border border-border rounded-2xl px-4 py-3 shadow-soft hidden md:flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-full gradient-teal flex items-center justify-center">
              <WifiOff className="h-4 w-4 text-background" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t.floating.offlineSub}</div>
              <div className="text-sm font-semibold">{t.floating.offlineTitle}</div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute -right-4 bottom-10 bg-card border border-border rounded-2xl px-4 py-3 shadow-soft hidden md:flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-full bg-[oklch(0.78_0.16_75)] flex items-center justify-center">
              <Printer className="h-4 w-4 text-ink" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t.floating.receiptSub}</div>
              <div className="text-sm font-semibold">{t.floating.receiptTitle}</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}"""
code = re.sub(r'function Hero\(\) \{[\s\S]*?    </section>\n  \);\n}', hero_def, code)

# 5. Modify ValuePills
vp_def = """function ValuePills({ t }: { t: any }) {
  const pills = [
    { icon: WifiOff, ...t.pill1 },
    { icon: Smartphone, ...t.pill2 },
    { icon: Cloud, ...t.pill3 },
  ];
  return (
    <section className="border-y border-border bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-3 gap-8">
        {pills.map((p: any, i) => (
          <motion.div
            key={p.t}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4"
          >
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-background border border-border flex items-center justify-center shadow-soft">
              <p.icon className="h-5 w-5 text-[oklch(0.45_0.16_25)]" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">{p.t}</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{p.s}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}"""
code = re.sub(r'function ValuePills\(\) \{[\s\S]*?    </section>\n  \);\n}', vp_def, code)

# Write back
with open("src/components/landing/Landing.tsx", "w", encoding="utf-8") as f:
    f.write(code)
