import { BatteryFull, Signal, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative mx-auto h-[780px] w-[390px] max-w-full overflow-hidden rounded-[44px] border-[10px] border-tanah-900 bg-kabut shadow-raised", className)}>
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-tanah-900" />
      <div aria-hidden className="num flex h-11 items-end justify-between px-7 pb-1 text-xs font-semibold text-tanah-900">
        <span>09.41</span>
        <span className="flex items-center gap-1"><Signal className="h-3.5 w-3.5" /><Wifi className="h-3.5 w-3.5" /><BatteryFull className="h-4 w-4" /></span>
      </div>
      <div className="h-[calc(100%-2.75rem)] overflow-y-auto pb-6">{children}</div>
      <div aria-hidden className="pointer-events-none absolute bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-tanah-900/70" />
    </div>
  );
}
