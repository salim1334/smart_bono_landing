import { motion } from "motion/react";
import { ArrowRight, Printer, WifiOff } from "lucide-react";
import phonePrinter from "@/assets/phone-printer.png";

export function Hero({
  t,
  onBookDemo,
}: {
  t: {
    btnPricing: string;
    btnHow: string;
    btnDemo?: string;
    [key: string]: unknown;
  };
  onBookDemo: () => void;
}) {
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
            <span className="italic text-[oklch(0.45_0.16_25)]">
              {t.title2}
            </span>
            <br />
            {t.title3}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            {t.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onBookDemo}
              className="inline-flex items-center gap-2 rounded-full gradient-burgundy text-background px-6 py-3.5 text-sm font-semibold shadow-soft hover:opacity-95 transition"
            >
              {(t.btnDemo as string) || "Book a free demo"}{" "}
              <ArrowRight className="h-4 w-4" />
            </button>
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
                <dt className="font-display text-3xl font-bold text-ink">
                  {s.k}
                </dt>
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
            <img
              src={phonePrinter}
              alt="Smart bono on a phone printing a receipt"
              className="w-full h-auto"
            />
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
              <div className="text-xs text-muted-foreground">
                {t.floating.offlineSub}
              </div>
              <div className="text-sm font-semibold">
                {t.floating.offlineTitle}
              </div>
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
              <div className="text-xs text-muted-foreground">
                {t.floating.receiptSub}
              </div>
              <div className="text-sm font-semibold">
                {t.floating.receiptTitle}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
