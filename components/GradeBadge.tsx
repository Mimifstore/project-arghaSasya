import { cn } from "@/lib/utils";
import type { Grade } from "@/data/agri";

const TONE: Record<Grade, string> = { A: "bg-daun-600 text-white", B: "bg-kunyit-400 text-tanah-950", C: "bg-tanah-200 text-tanah-800" };

export function GradeBadge({ grade, className }: { grade: Grade; className?: string }) {
  return <span className={cn("inline-grid h-7 min-w-[4rem] place-items-center rounded-md px-2 text-xs font-bold", TONE[grade], className)}>Grade {grade}</span>;
}
