import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const backdropStyle = {
  background: "rgba(24, 16, 8, 0.72)",
  backdropFilter: "blur(4px)",
} as const;

export function ModalBackdrop({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-100 overflow-y-auto overscroll-contain"
      style={backdropStyle}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
}

export function ModalPanel({
  children,
  className,
  maxWidth = "max-w-lg",
}: {
  children: ReactNode;
  className?: string;
  maxWidth?: "max-w-md" | "max-w-lg";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 16 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-glow",
        "max-h-[min(90dvh,calc(100dvh-2rem))]",
        maxWidth,
        className,
      )}
    >
      <div className="h-1 w-full shrink-0 gradient-burgundy" />
      {children}
    </motion.div>
  );
}

/** Scrollable modal content area (use with fixed ModalFooter for actions). */
export function ModalScrollBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "shrink-0 border-t border-border/60 bg-card px-6 sm:px-8 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
