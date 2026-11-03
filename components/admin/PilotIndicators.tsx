import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Syarat lanjut pilot (dokumen, bulan 7) beserta nilai SIMULASI. "lower" berarti makin kecil makin baik.
const ITEMS: { label: string; value: number; target: number; unit: string; lower?: boolean; max: number }[] = [
  { label: "Volume bulanan", value: 3800, target: 3000, unit: " kg", max: 5000 },
  { label: "Pembeli memesan ulang", value: 60, target: 50, unit: "%", max: 100 },
  { label: "Petani mengirim ulang", value: 64, target: 60, unit: "%", max: 100 },
  { label: "Dana cair dalam 2 hari kerja", value: 93, target: 90, unit: "%", max: 100 },
  { label: "Akurasi grading AI", value: 88, target: 85, unit: "%", max: 100 },
  { label: "Penyesuaian harga rata-rata", value: 3.1, target: 5, unit: "%", lower: true, max: 8 },
];

export function PilotIndicators() {
  return (
    <ul className="divide-y divide-line">
      {ITEMS.map((x) => {
        const ok = x.lower ? x.value <= x.target : x.value >= x.target;
        const fmt = (n: number) => n.toLocaleString("id-ID") + x.unit;
        return (
          <li key={x.label} className="py-3.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">{x.label}</span>
              <span className="flex items-center gap-2"><span className="num font-semibold">{fmt(x.value)}</span><Badge tone={ok ? "success" : "warning"}>{ok ? "Tercapai" : "Belum"}</Badge></span>
            </div>
            <div className="relative mt-2 h-2 rounded-full bg-tanah-100">
              <div className={cn("h-full rounded-full", ok ? "bg-daun-600" : "bg-kunyit-400")} style={{ width: `${(x.value / x.max) * 100}%` }} />
              <span className="absolute -top-1 h-4 w-0.5 bg-tanah-900" style={{ left: `${(x.target / x.max) * 100}%` }} aria-hidden />
            </div>
            <p className="num mt-1 text-xs text-tanah-500">Syarat: {x.lower ? "maks. " : "min. "}{fmt(x.target)}</p>
          </li>
        );
      })}
    </ul>
  );
}
