import { Cloud } from "lucide-react";
import { motion } from "motion/react";
import hybrid from "@/assets/hybrid.png";
import { Users, ChefHat, Wallet, LineChart } from "lucide-react";

export function Hybrid() {
  const steps = [
    { icon: Users, t: "Waiter takes the order", s: "Tap items on a phone, send straight to the kitchen.", color: "bg-[oklch(0.78_0.16_75)] text-ink" },
    { icon: ChefHat, t: "Kitchen sees it instantly", s: "Live ticket display, no scribbled paper, no missed items.", color: "gradient-teal text-background" },
    { icon: Wallet, t: "Cashier closes the bill", s: "Payment, printing and reporting in two taps.", color: "gradient-burgundy text-background" },
    { icon: LineChart, t: "Owner watches live", s: "Real-time sales and analytics from anywhere in the world.", color: "bg-ink text-background" },
  ];
  return (
    <section id="hybrid" className="bg-ink text-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.5 0.08 195) 0%, transparent 40%), radial-gradient(circle at 80% 80%, oklch(0.78 0.16 75) 0%, transparent 40%)" }} />
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[oklch(0.78_0.16_75)]">
            <Cloud className="h-3.5 w-3.5" /> The Hybrid Ecosystem
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 leading-tight">
            Waiter, Kitchen, Cashier — <span className="italic text-[oklch(0.78_0.16_75)]">in sync.</span>
          </h2>
          <p className="mt-5 text-lg text-background/70 leading-relaxed">
            When you're ready to scale, Smart bono Hybrid connects every role in your cafe. Orders flow
            instantly across devices and into the cloud — so owners can manage the floor from anywhere.
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-3xl overflow-hidden border border-background/10 shadow-glow">
            <img src={hybrid} alt="Smart bono hybrid ecosystem diagram" className="w-full h-auto bg-background" />
          </div>

          <ol className="space-y-5">
            {steps.map((s, i) => (
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
                  <div className="text-xs font-mono text-background/50">STEP 0{i + 1}</div>
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