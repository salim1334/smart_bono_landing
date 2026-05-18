import { Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import manApp from "@/assets/man-app.png";

export function SmartPrinting() {
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
            <Sparkles className="h-3.5 w-3.5" /> Smart Printing
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 leading-tight text-ink">
            One phone is all your floor needs.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Forget bulky desktops and tangled cables. Smart bono pairs wirelessly with any thermal
            printer, so your cashier carries the entire counter in their pocket.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              ["Bluetooth thermal printing", "Pair once, print forever — receipts in Amharic & English."],
              ["No PC, no clutter", "A modern, sleek counter that fits any cafe aesthetic."],
              ["Professional receipts", "Custom header, logo, taxes and totals — every time."],
            ].map(([t, s]) => (
              <li key={t} className="flex gap-4">
                <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full gradient-teal flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-background" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{t}</div>
                  <div className="text-sm text-muted-foreground">{s}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}