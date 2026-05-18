import { ArrowRight } from "lucide-react";

export function CTA({ t }: { t: any }) {
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