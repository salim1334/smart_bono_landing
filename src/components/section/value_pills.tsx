import { motion } from "motion/react";
import { WifiOff, Smartphone, Cloud } from "lucide-react";

export function ValuePills({ t }: { t: any }) {
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