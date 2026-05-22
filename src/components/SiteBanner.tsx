import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { contentService } from "@/lib/firestore";
import type { Language } from "@/locales/dictionaries";
import type { ActiveSiteBanner } from "@/types/types";

const VARIANT_STYLES = {
  info: "bg-[oklch(0.5_0.08_195)] text-background",
  promo: "gradient-burgundy text-background",
  warning: "bg-[oklch(0.78_0.16_75)] text-ink",
} as const;

function dismissStorageKey(dismissKey: string) {
  return `dismissed_banner_${dismissKey}`;
}

export function SiteBanner({ lang }: { lang: Language }) {
  const [banner, setBanner] = useState<ActiveSiteBanner | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void contentService.getActiveSiteBanner().then((active) => {
      if (cancelled) return;
      if (!active) {
        setBanner(null);
        return;
      }
      const key = dismissStorageKey(active.dismissKey);
      const wasDismissed =
        active.content.dismissible &&
        typeof localStorage !== "undefined" &&
        localStorage.getItem(key) === "1";
      setBanner(active);
      setDismissed(wasDismissed);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!banner || dismissed) return null;

  const { content } = banner;
  const isAm = lang === "am";
  const title = isAm ? content.titleAm : content.titleEn;
  const message = isAm ? content.messageAm : content.messageEn;
  const ctaLabel = isAm
    ? content.ctaLabelAm || content.ctaLabelEn
    : content.ctaLabelEn || content.ctaLabelAm;
  const variantClass = VARIANT_STYLES[content.variant] ?? VARIANT_STYLES.promo;

  const handleDismiss = () => {
    if (content.dismissible) {
      localStorage.setItem(dismissStorageKey(banner.dismissKey), "1");
    }
    setDismissed(true);
  };

  return (
    <div
      className={`sticky top-0 z-50 w-full ${variantClass} shadow-soft`}
      role="region"
      aria-label="Announcement"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm md:text-base truncate">
            {title}
          </p>
          <p className="text-xs md:text-sm opacity-90 line-clamp-2">{message}</p>
        </div>
        {ctaLabel && content.ctaUrl ? (
          <a
            href={content.ctaUrl}
            className="shrink-0 rounded-full bg-background/20 hover:bg-background/30 px-4 py-2 text-xs font-semibold transition backdrop-blur-sm"
          >
            {ctaLabel}
          </a>
        ) : null}
        {content.dismissible ? (
          <button
            type="button"
            onClick={handleDismiss}
            className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center hover:bg-background/20 transition"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
