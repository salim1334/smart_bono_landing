import { ShieldCheck, WifiOff, Languages } from "lucide-react";

export function Trust({ t }: { t: any }) {
  const items = [
    { icon: ShieldCheck, ...t.items[0] },
    { icon: WifiOff, ...t.items[1] },
    { icon: Languages, ...t.items[2] },
  ];
  return (
    <section id="trust" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it: any, i) => (
          <div key={i} className="rounded-3xl border border-border bg-card p-7 shadow-soft">
            <div className="h-11 w-11 rounded-2xl gradient-teal flex items-center justify-center">
              <it.icon className="h-5 w-5 text-background" />
            </div>
            <h3 className="font-display text-xl font-bold mt-5">{it.t}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{it.s}</p>
          </div>
        ))}
      </div>
    </section>
  );
}