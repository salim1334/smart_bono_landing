import { ArrowRight } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { Language } from "@/locales/dictionaries";

export function NavBar({ lang, setLang, t }: { lang: Language, setLang: (l: Language) => void, t: any }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <img src={logo} alt="Smart bono" className="h-9 w-9 object-contain" />
          <span className="font-display text-xl font-bold tracking-tight">
            Smart <span className="text-[oklch(0.5_0.08_195)]">ቦኖ</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#printing" className="hover:text-foreground transition">{t.smartPrinting}</a>
          <a href="#hybrid" className="hover:text-foreground transition">{t.hybrid}</a>
          <a href="#pricing" className="hover:text-foreground transition">{t.pricing}</a>
          <a href="#trust" className="hover:text-foreground transition">{t.trust}</a>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            {lang === 'en' ? 'አማ' : 'EN'}
          </button>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-full bg-ink text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition"
          >
            {t.getStarted} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}