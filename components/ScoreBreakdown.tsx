import { SCORE_WEIGHTS, type Components } from "@/data/agri";
import { cn } from "@/lib/utils";

export function ScoreBreakdown({ c, dark }: { c: Components; dark?: boolean }) {
  return (
    <ul className="space-y-2.5">
      {SCORE_WEIGHTS.map((w, i) => (
        <li key={w.key}>
          <div className="flex justify-between text-xs">
            <span className={dark ? "text-tanah-300" : "text-tanah-600"}>{w.label} ({w.weight}%)</span>
            <span className="num font-semibold">{c[i]}</span>
          </div>
          <div className={cn("mt-1 h-1.5 overflow-hidden rounded-full", dark ? "bg-tanah-700" : "bg-tanah-100")}>
            <div className="h-full rounded-full bg-kunyit-400" style={{ width: `${c[i]}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
