import { useEffect, useState } from "react";
import { contentService } from "@/lib/firestore";
import { getDefaultPricingConfigUI } from "@/lib/cms-defaults";
import type { Language } from "@/locales/dictionaries";
import type { PricingConfigUI } from "@/lib/types";

export function usePricingContent(lang: Language) {
  const [config, setConfig] = useState<PricingConfigUI>(() =>
    getDefaultPricingConfigUI(lang),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void contentService.loadPricingContent(lang).then((data) => {
      if (!cancelled) {
        setConfig(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return { config, loading };
}
