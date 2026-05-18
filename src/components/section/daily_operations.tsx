import { motion } from "motion/react";
import { Smartphone } from "lucide-react";
import cafeteria from "@/assets/cafeteria.png";
import successPrint from "@/assets/success-print.png";

function Mini({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="font-display text-2xl font-bold">{label}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}

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

export function DailyOperations() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[oklch(0.45_0.16_25)]">
            <Smartphone className="h-3.5 w-3.5" /> Floor Operations
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 leading-tight text-ink">
            Tap, order, and <span className="italic text-[oklch(0.45_0.16_25)]">print instantly.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Easily browse products, take orders, and print receipts in seconds. Keep track of all-day sales, monitor delivered items directly from the counter, and view performance for every individual waiter on your shift.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Mini label="Quick Ordering" sub="Visual product menu" />
            <Mini label="Instant Print" sub="Zero-delay receipts" />
            <Mini label="Daily Sales" sub="Track shifts easily" />
            <Mini label="Waiter Stats" sub="Individual performance" />
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