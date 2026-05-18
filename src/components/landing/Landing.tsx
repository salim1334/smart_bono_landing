import { useState } from "react";
import { Language, dictionaries } from "@/locales/dictionaries";
import { PhoneMockup } from "../ui/phone-mockup";
import { CTA } from "../section/cta";
import { Trust } from "../section/trust";
import { Pricing } from "../section/pricing";
import { AdminControl } from "../section/admin_control";
import { DailyOperations } from "../section/daily_operations";
import { Hybrid } from "../section/hybrid";
import { SmartPrinting } from "../section/smart_printing";
import { ValuePills } from "../section/value_pills";
import { Hero } from "../section/hero";
import { NavBar } from "../section/navbar";
import { Footer } from "../section/footer";

type Term = 3 | 6 | 12;

export function Landing() {
  const [term, setTerm] = useState<Term>(6);
  const [lang, setLang] = useState<Language>("en");
  const t = dictionaries[lang];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar lang={lang} setLang={setLang} t={t.nav} />
      <Hero t={t.hero} />
      <ValuePills t={t.valuePills} />
      <SmartPrinting t={t.smartPrinting} />
      <Hybrid t={t.hybrid} />
      <DailyOperations t={t.dailyOps} />
      <AdminControl t={t.admin} />
      <Pricing term={term} setTerm={setTerm} t={t.pricing} />
      <Trust t={t.trust} />
      <CTA t={t.cta} />
      <Footer t={t.footer} />
      <PhoneMockup className="hidden" children={undefined} />
    </div>
  );
}
