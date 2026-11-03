import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZES = { md: "h-11 w-11", lg: "h-14 w-14" };

// Logo resmi Argha Sasya (emblem bulat). Di ukuran kecil tulisan di dalam emblem tidak terbaca,
// jadi nama ditulis lagi di sampingnya. Pakai showName={false} kalau emblem dipasang cukup besar.
export function Logo({ tone = "dark", size = "md", showName = true, className }: {
  tone?: "dark" | "light"; size?: keyof typeof SIZES; showName?: boolean; className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image src="/logo/mark.png" width={440} height={440} alt={showName ? "" : "Argha Sasya"} className={cn("shrink-0 rounded-full", SIZES[size])} />
      {showName && (
        <span className={cn("font-display text-xl font-bold tracking-tight", tone === "light" ? "text-white" : "text-tanah-950")}>Argha Sasya</span>
      )}
    </span>
  );
}
