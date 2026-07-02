import { Cloud } from "lucide-react";
import { motion } from "motion/react";
import hybrid from "@/assets/hybrid-ecosystem.jpeg";
import { Users, ChefHat, Wallet, LineChart } from "lucide-react";

export function Hybrid({ t }: { t: any }) {
  const steps = [
    { icon: Users, ...t.steps[0], color: "bg-[oklch(0.78_0.16_75)] text-ink" },
    { icon: ChefHat, ...t.steps[1], color: "gradient-teal text-background" },
    { icon: Wallet, ...t.steps[2], color: "gradient-burgundy text-background" },
    { icon: LineChart, ...t.steps[3], color: "bg-ink text-background" },
  ];
  return (
    <section
      id="hybrid"
      className="bg-ink text-background relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, oklch(0.5 0.08 195) 0%, transparent 40%), radial-gradient(circle at 80% 80%, oklch(0.78 0.16 75) 0%, transparent 40%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[oklch(0.78_0.16_75)]">
            <Cloud className="h-3.5 w-3.5" /> {t.badge}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 leading-tight">
            {t.title1}{" "}
            <span className="italic text-[oklch(0.78_0.16_75)]">
              {t.title2}
            </span>
          </h2>
          <p className="mt-5 text-lg text-background/70 leading-relaxed">
            {t.sub}
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-3xl overflow-hidden border border-background/10 shadow-glow">
            <img
              src={hybrid}
              alt="Smart bono hybrid ecosystem diagram"
              className="w-full h-auto bg-background"
            />
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
                <div
                  className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center ${s.color}`}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-background/50">
                    {s.lbl}
                  </div>
                  <div className="font-display text-xl font-bold mt-0.5">
                    {s.t}
                  </div>
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
