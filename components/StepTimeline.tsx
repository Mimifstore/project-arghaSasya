import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTanggal } from "@/lib/utils";

export type Step = { key: string; label: string; date?: string };

function Dot({ state }: { state: "done" | "current" | "todo" }) {
  if (state === "done")
    return <span className="grid h-8 w-8 place-items-center rounded-full bg-daun-600 text-white"><Check className="h-4 w-4" strokeWidth={3} /></span>;
  if (state === "current")
    return <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-kunyit-400 bg-white"><span className="h-3 w-3 rounded-full bg-kunyit-400" /></span>;
  return <span className="h-8 w-8 rounded-full border-2 border-tanah-200 bg-white" />;
}

export function StepTimeline({ steps, current, orientation = "horizontal", className }: {
  steps: Step[]; current: number; orientation?: "horizontal" | "vertical"; className?: string;
}) {
  const state = (i: number) => (i < current ? "done" : i === current ? "current" : "todo");
  const vertical = orientation === "vertical";

  return (
    <ol className={cn(vertical ? "flex flex-col" : "flex w-full", className)}>
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const lineColor = i < current ? "bg-daun-600" : "bg-tanah-200";
        const text = (
          <div className={cn(vertical ? "pb-6 pt-1" : "mt-3 px-1 text-center")}>
            <p className={cn("text-sm", state(i) === "todo" ? "text-tanah-500" : "font-semibold text-tanah-900")}>{s.label}</p>
            {s.date && <p className="num mt-0.5 text-xs text-tanah-500">{formatTanggal(s.date)}</p>}
          </div>
        );
        return vertical ? (
          <li key={s.key} className="flex gap-4" aria-current={state(i) === "current" ? "step" : undefined}>
            <div className="flex flex-col items-center">
              <Dot state={state(i)} />
              {!last && <span className={cn("mt-1 w-0.5 flex-1", lineColor)} />}
            </div>
            {text}
          </li>
        ) : (
          <li key={s.key} className="relative flex-1" aria-current={state(i) === "current" ? "step" : undefined}>
            {!last && <span className={cn("absolute left-1/2 top-4 h-0.5 w-full -translate-y-1/2", lineColor)} />}
            <div className="relative z-10 mx-auto w-8"><Dot state={state(i)} /></div>
            {text}
          </li>
        );
      })}
    </ol>
  );
}
