import { motion } from "motion/react";
import { ShieldCheck, Check } from "lucide-react";
import adminSales from "@/assets/admin-sales.jpg";

function PhoneMockup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto bg-zinc-800 border-[6px] border-zinc-800 rounded-[2.5rem] shadow-2xl ${className}`}>
      {/* Dynamic island */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[84px] h-[24px] bg-black rounded-full z-20 flex items-center justify-end px-2">
         {/* Small camera dot */}
         <div className="w-2 h-2 rounded-full bg-blue-900/30"></div>
      </div>

      {/* Screen */}
      <div className="rounded-[2.1rem] overflow-hidden w-full h-full bg-background relative z-10 border-[6px] border-black">
        {children}
      </div>
    </div>
  );
}

export function AdminControl() {
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
            <img src={adminSales} alt="Admin sales report dashboard" className="w-full h-auto block" />
          </PhoneMockup>
        </motion.div>

        <div className="order-1 lg:order-2">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[oklch(0.5_0.08_195)]">
            <ShieldCheck className="h-3.5 w-3.5" /> Back-Office Management
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 leading-tight text-ink">
            Administer sales from <br /> <span className="italic text-[oklch(0.5_0.08_195)]">anywhere.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            As an admin, you have a bird's-eye view of your entire business. Monitor live sales, track detailed orders, and review staff performance without stepping foot in the cafe.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              ["Live Sales Dashboards", "Get real-time insights into your top-selling items and overall revenue."],
              ["Staff & Waiter Tracking", "See exactly who is processing orders and analyze their productivity."],
              ["Complete Order History", "Deep dive into past transactions, refunds, and daily summaries."],
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
      </div>
    </section>
  );
}