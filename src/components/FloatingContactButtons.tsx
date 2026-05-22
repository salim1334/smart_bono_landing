import { TELEGRAM_URL } from "@/lib/contact";

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

export function FloatingContactButtons({
  label,
  ariaLabel,
}: {
  label: string;
  ariaLabel: string;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="group flex items-center gap-2.5 rounded-full bg-[#229ED9] text-white pl-3.5 pr-4 py-3 shadow-[0_8px_30px_rgba(34,158,217,0.45)] ring-2 ring-white/20 hover:bg-[#1d8fc7] hover:scale-[1.02] active:scale-[0.98] transition"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
          <TelegramIcon className="h-5 w-5" />
        </span>
        <span className="text-sm font-semibold pr-0.5 max-w-44 sm:max-w-none leading-tight">
          {label}
        </span>
      </a>
    </div>
  );
}
