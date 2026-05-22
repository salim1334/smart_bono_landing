export function PhoneMockup({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto bg-zinc-800 border-[2px] border-zinc-800 rounded-[2.5rem] shadow-2xl ${className}`}
    >
      {/* Samsung-style front camera */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="w-3 h-3 rounded-full bg-black flex items-center justify-center shadow-inner">
          <div className="w-[5px] h-[5px] rounded-full bg-zinc-700"></div>
        </div>
      </div>

      {/* Screen */}
      <div className="rounded-[2.1rem] overflow-hidden w-full h-full bg-background relative z-10 border-[6px] border-black">
        {children}
      </div>
    </div>
  );
}
