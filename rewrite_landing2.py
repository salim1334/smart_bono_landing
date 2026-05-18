import re

with open("src/components/landing/Landing.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# SmartPrinting
sp_def = """function SmartPrinting({ t }: { t: any }) {
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
}"""
code = re.sub(r'function SmartPrinting\(\) \{[\s\S]*?    </section>\n  \);\n}', sp_def, code)

# Hybrid
hb_def = """function Hybrid({ t }: { t: any }) {
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
}"""
code = re.sub(r'function Hybrid\(\) \{[\s\S]*?    </section>\n  \);\n}', hb_def, code)

# DailyOperations
do_def = """function DailyOperations({ t }: { t: any }) {
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
}"""
code = re.sub(r'function DailyOperations\(\) \{[\s\S]*?    </section>\n  \);\n}', do_def, code)

# AdminControl
ac_def = """function AdminControl({ t }: { t: any }) {
  return (
    <section className="border-t border-border bg-muted/30">
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
}"""
code = re.sub(r'function AdminControl\(\) \{[\s\S]*?    </section>\n  \);\n}', ac_def, code)

# Mini
code = re.sub(r'function Mini\(\{.*?\}', 'function Mini({ label, sub }: { label: string; sub: string }) {', code)

with open("src/components/landing/Landing.tsx", "w", encoding="utf-8") as f:
    f.write(code)

