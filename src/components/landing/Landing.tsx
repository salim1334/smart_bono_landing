import { useState } from "react";
import { motion } from "motion/react";
import { Language, dictionaries } from "@/locales/dictionaries";
import {
  WifiOff,
  Printer,
  Smartphone,
  Cloud,
  ShieldCheck,
  Languages,
  Check,
  ArrowRight,
  ChefHat,
  Users,
  Wallet,
  LineChart,
  Sparkles,
} from "lucide-react";
import logo from "@/assets/logo.jpg";
import phonePrinter from "@/assets/phone-printer.png";
import manApp from "@/assets/man-app.png";
import hybrid from "@/assets/hybrid-ecosystem.png";
import cafeteria from "@/assets/cafeteria-screen.jpg";
import adminSales from "@/assets/admin-sales.jpg";
import successPrint from "@/assets/success-print.jpg";

type Term = 3 | 6 | 12;

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

const termLabels: Record<Term, { label: string; save: string; mult: number }> = {
  3: { label: "3 months", save: "", mult: 3 },
  6: { label: "6 months", save: "Save 10%", mult: 6 * 0.9 },
  12: { label: "12 months", save: "Save 20%", mult: 12 * 0.8 },
};

export function Landing() {
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
      <PhoneMockup className="hidden" children={undefined} />
    </div>
  );
}

function Nav({ lang, setLang, t }: { lang: Language, setLang: (l: Language) => void, t: any }) {
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
}

function Hero({ t }: { t: any }) {
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
}

function ValuePills({ t }: { t: any }) {
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
}

function SmartPrinting({ t }: { t: any }) {
  return (
    <section id="printing" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="order-2 lg:order-1"
        >
          <div className="rounded-3xl overflow-hidden border border-border shadow-soft">
            <img src={manApp} alt="A cashier proudly showing Smart bono and a printed receipt" className="w-full h-auto" />
          </div>
        </motion.div>

        <div className="order-1 lg:order-2">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[oklch(0.5_0.08_195)]">
            <Sparkles className="h-3.5 w-3.5" /> {t.badge}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 leading-tight text-ink">
            {t.title}
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            {t.sub}
          </p>

          <ul className="mt-8 space-y-4">
            {t.features.map((f: any) => (
              <li key={f.t} className="flex gap-4">
                <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full gradient-teal flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-background" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{f.t}</div>
                  <div className="text-sm text-muted-foreground">{f.s}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Hybrid({ t }: { t: any }) {
  const steps = [
    { icon: Users, ...t.steps[0], color: "bg-[oklch(0.78_0.16_75)] text-ink" },
    { icon: ChefHat, ...t.steps[1], color: "gradient-teal text-background" },
    { icon: Wallet, ...t.steps[2], color: "gradient-burgundy text-background" },
    { icon: LineChart, ...t.steps[3], color: "bg-ink text-background" },
  ];
  return (
    <section id="hybrid" className="bg-ink text-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.5 0.08 195) 0%, transparent 40%), radial-gradient(circle at 80% 80%, oklch(0.78 0.16 75) 0%, transparent 40%)" }} />
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[oklch(0.78_0.16_75)]">
            <Cloud className="h-3.5 w-3.5" /> {t.badge}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 leading-tight">
            {t.title1} <span className="italic text-[oklch(0.78_0.16_75)]">{t.title2}</span>
          </h2>
          <p className="mt-5 text-lg text-background/70 leading-relaxed">
            {t.sub}
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-3xl overflow-hidden border border-background/10 shadow-glow">
            <img src={hybrid} alt="Smart bono hybrid ecosystem diagram" className="w-full h-auto bg-background" />
          </div>

          <ol className="space-y-5">
            {steps.map((s: any, i) => (
              <motion.li
                key={s.t}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-5 rounded-2xl border border-background/10 bg-background/5 backdrop-blur p-5"
              >
                <div className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-background/50">{s.lbl}</div>
                  <div className="font-display text-xl font-bold mt-0.5">{s.t}</div>
                  <div className="text-sm text-background/70 mt-1">{s.s}</div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function DailyOperations({ t }: { t: any }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[oklch(0.45_0.16_25)]">
            <Smartphone className="h-3.5 w-3.5" /> {t.badge}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 leading-tight text-ink">
            {t.title1} <span className="italic text-[oklch(0.45_0.16_25)]">{t.title2}</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            {t.sub}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {t.minis.map((m: any, i: number) => (
              <Mini key={i} label={m.lbl} sub={m.sub} />
            ))}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4 sm:gap-6 items-start"
        >
          <PhoneMockup>
            <img src={cafeteria} alt="Cafeteria menu layout" className="w-full h-auto block" />
          </PhoneMockup>
          <PhoneMockup className="mt-4 md:mt-12">
            <img src={successPrint} alt="Successful order confirmation" className="w-full h-auto block" />
          </PhoneMockup>
        </motion.div>
      </div>
    </section>
  );
}

function AdminControl({ t }: { t: any }) {
  return (
    <section className="border-t border-border gradient-hero">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="order-2 lg:order-1"
        >
          <PhoneMockup className="w-[85%] lg:w-[70%]">
            <img src={adminSales} alt="Admin sales report dashboard" className="w-full h-auto block" />
          </PhoneMockup>
        </motion.div>

        <div className="order-1 lg:order-2">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[oklch(0.5_0.08_195)]">
            <ShieldCheck className="h-3.5 w-3.5" /> {t.badge}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 leading-tight text-ink">
            {t.title1} <br /> <span className="italic text-[oklch(0.5_0.08_195)]">{t.title2}</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            {t.sub}
          </p>

          <ul className="mt-8 space-y-4">
            {t.features.map((f: any, i: number) => (
              <li key={i} className="flex gap-4">
                <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full gradient-teal flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-background" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{f.t}</div>
                  <div className="text-sm text-muted-foreground">{f.s}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </div>
    </section>
  );
}

function Mini({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="font-display text-2xl font-bold">{label}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}

function Pricing({ term, setTerm, t }: { term: Term; setTerm: (t: Term) => void; t: any }) {
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
}

function Trust({ t }: { t: any }) {
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
}

function CTA({ t }: { t: any }) {
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
}

function Footer({ t }: { t: any }) {
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
}

function PhoneMockup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative mx-auto bg-zinc-800 border-[2px] border-zinc-800 rounded-[2.5rem] shadow-2xl ${className}`}
    >
      {/* Samsung-style front camera */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="w-3 h-3 rounded-full bg-black flex items-center justify-center shadow-inner">
          <div className="w-[5px] h-[5px] rounded-full bg-zinc-700"></div>
        </div>
      </div>

      {/* Screen */}
      <div className="rounded-[2.1rem] overflow-hidden w-full h-full bg-background relative z-10 border-[6px] border-black">
        {children}
      </div>
    </div>
  );
}