import { motion } from "motion/react";
import { Smartphone } from "lucide-react";
import cafeteria from "@/assets/cafeteria-screen.jpg";
import successPrint from "@/assets/success-print.jpg";
import { PhoneMockup } from "../ui/phone-mockup";

function Mini({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="font-display text-2xl font-bold">{label}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}

export function DailyOperations({ t }: { t: any }) {
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