import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Language, dictionaries } from '@/locales/dictionaries';
import type { AuthSignInResult } from '@/contexts/AuthContext';
import { DemoBookingModal } from '@/components/modals/DemoBookingModal';
import { AuthModal } from '@/components/modals/AuthModal';
import { OnboardingModal } from '@/components/modals/OnboardingModal';
import {
  PlanSelectionModal,
  type PlanSelection,
} from '@/components/modals/PlanSelectionModal';
import type { PlanTier } from '@/lib/types';
import { SiteBanner } from '@/components/SiteBanner';
import { FloatingContactButtons } from '@/components/FloatingContactButtons';
import { usePricingContent } from '@/hooks/use-pricing-content';
import { PhoneMockup } from '../ui/phone-mockup';
import { CTA } from '../section/cta';
import { Trust } from '../section/trust';
import { Pricing } from '../section/pricing';
import { AdminControl } from '../section/admin_control';
import { DailyOperations } from '../section/daily_operations';
import { Hybrid } from '../section/hybrid';
import { SmartPrinting } from '../section/smart_printing';
import { ValuePills } from '../section/value_pills';
import { Hero } from '../section/hero';
import { NavBar } from '../section/navbar';
import { Footer } from '../section/footer';

type Term = 3 | 6 | 12;

export function Landing() {
  const navigate = useNavigate();
  const [term, setTerm] = useState<Term>(6);
  const [lang, setLang] = useState<Language>('am');

  useEffect(() => {
    document.documentElement.lang = lang === 'am' ? 'am' : 'en';
  }, [lang]);
  const [demoOpen, setDemoOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanSelection | null>(null);
  const t = dictionaries[lang];
  const { config: pricingConfig } = usePricingContent(lang);
  const openDemo = () => setDemoOpen(true);

  const handleSelectPlan = (tier: PlanTier) => {
    setSelectedPlan({ tier, term });
    setPlanModalOpen(true);
  };

  const handleAuthComplete = (result: AuthSignInResult) => {
    if (result.isAdmin) {
      navigate({ to: '/admin' });
      return;
    }
    if (result.needsOnboarding) {
      setOnboardingOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteBanner lang={lang} />
      <NavBar
        lang={lang}
        setLang={setLang}
        t={t.nav}
        onBookDemo={openDemo}
        onSignIn={() => setAuthOpen(true)}
      />
      <Hero t={t.hero} onBookDemo={openDemo} />
      <ValuePills t={t.valuePills} />
      <SmartPrinting t={t.smartPrinting} />
      <Hybrid t={t.hybrid} />
      <DailyOperations t={t.dailyOps} />
      <AdminControl t={t.admin} />
      <Pricing
        term={term}
        setTerm={setTerm}
        pricingData={pricingConfig}
        onSelectPlan={handleSelectPlan}
      />
      <Trust t={t.trust} />
      <CTA t={t.cta} onBookDemo={openDemo} />
      <Footer t={t.footer} />
      <FloatingContactButtons
        label={t.floatingContact.label}
        ariaLabel={t.floatingContact.ariaLabel}
      />
      <PhoneMockup className="hidden" children={undefined} />
      <DemoBookingModal
        t={t.demoBooking}
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
      />
      <AuthModal
        t={t.authModal}
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onComplete={handleAuthComplete}
      />
      <OnboardingModal
        t={t.onboarding}
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />
      <PlanSelectionModal
        t={t.planSelection}
        isOpen={planModalOpen}
        onClose={() => {
          setPlanModalOpen(false);
          setSelectedPlan(null);
        }}
        selection={selectedPlan}
        pricingTiers={pricingConfig.tiers}
      />
    </div>
  );
}
