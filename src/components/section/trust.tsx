import { ShieldCheck, WifiOff, Languages } from "lucide-react";

export function Trust() {
  const items = [
    { icon: ShieldCheck, t: "Data backup", s: "Your sales data is safely backed up — on device and (optionally) in the cloud." },
    { icon: WifiOff, t: "Connectivity-proof", s: "Designed for Ethiopia: power cuts and dropped lines never lose a transaction." },
    { icon: Languages, t: "Bilingual support", s: "Onboarding, training and support in Amharic and English." },
  ];
  return (
    <section id="trust" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.t} className="rounded-3xl border border-border bg-card p-7 shadow-soft">
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