import { motion } from "motion/react";
import { ShieldCheck, Check } from "lucide-react";
import adminSales from "@/assets/admin-sales.jpg";
import { PhoneMockup } from "../ui/phone-mockup";

export function AdminControl({ t }: { t: any }) {
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
              <img
                src={adminSales}
                alt="Admin sales report dashboard"
                className="w-full h-auto block"
              />
            </PhoneMockup>
          </motion.div>

          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[oklch(0.5_0.08_195)]">
              <ShieldCheck className="h-3.5 w-3.5" /> {t.badge}
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 leading-tight text-ink">
              {t.title1} <br />{" "}
              <span className="italic text-[oklch(0.5_0.08_195)]">
                {t.title2}
              </span>
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
