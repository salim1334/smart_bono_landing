import { motion } from "motion/react";
import { WifiOff, Smartphone, Cloud } from "lucide-react";

export function ValuePills() {
  const pills = [
    { icon: WifiOff, t: "Reliability", s: "Works fully offline — power cuts and dropped connections never stop a sale." },
    { icon: Smartphone, t: "Modernity", s: "Print thermal receipts straight from your phone. No PC, no cables." },
    { icon: Cloud, t: "Control", s: "Optional hybrid sync gives owners live analytics from anywhere." },
  ];
  return (
    <section className="border-y border-border bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-3 gap-8">
        {pills.map((p, i) => (
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