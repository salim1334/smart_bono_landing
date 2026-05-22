import logo from "@/assets/logo.jpg";

export function Footer({ t }: { t: any }) {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="" className="h-7 w-7 object-contain" />
          <span className="font-display font-bold text-foreground">
            Smart ቦኖ
          </span>
          <span>· {t.by}</span>
        </div>
        <div>
          © {new Date().getFullYear()} Alarm Technology. {t.city}
        </div>
      </div>
    </footer>
  );
}
