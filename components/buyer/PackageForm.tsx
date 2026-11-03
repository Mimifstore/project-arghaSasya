"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { GRADES, RULES, allocate, quote, type Grade } from "@/data/agri";
import { cn, formatKg, formatRupiah } from "@/lib/utils";

const PRESETS = [500, 1000, 2000];

export function PackageForm() {
  const router = useRouter();
  const [kg, setKg] = useState("1000");
  const [grade, setGrade] = useState<Grade>("A");
  const [date, setDate] = useState("2026-12-12");
  const [place, setPlace] = useState("Dapur pusat CV Dapur Nusantara, Kiaracondong, Bandung");

  const n = Number(kg) || 0;
  const plan = useMemo(() => allocate(n, date), [n, date]);
  const done = n - plan.shortKg;
  const q = quote(done, grade, plan.allocs);
  const groups = new Set(plan.allocs.map((a) => a.farmer.group)).size;
  const rows: [string, string][] = [
    ["Petani terlibat", `${plan.allocs.length} petani dari ${groups} kelompok`],
    ["Jarak rata-rata ke titik kumpul", `${q.avgKm.toFixed(1).replace(".", ",")} km`],
    [`Nilai pasokan (${formatKg(done)})`, formatRupiah(q.gross)],
    [`Biaya layanan ${RULES.feeBuyerPct}%`, formatRupiah(q.feeBuyer)],
    ["Ongkos kirim (estimasi)", formatRupiah(q.logistics)],
  ];

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
      <form id="package-form" onSubmit={(e) => { e.preventDefault(); router.push(`/buyer/requests/1?kg=${n}&grade=${grade}&tgl=${date}`); }} className="surface p-6 lg:p-8">
        <section>
          <h2 className="text-base font-semibold">Paket pasokan</h2>
          <p className="mt-1 text-sm text-tanah-500">Pilih grade dan jumlah. Anda tidak perlu memilih petani, sistem yang membaginya.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Komoditas" hint="Pilot dimulai dari cabai merah keriting.">
              <Select disabled><option>Cabai merah keriting</option></Select>
            </Field>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-tanah-800">Grade</span>
              <div className="grid grid-cols-2 gap-2">
                {(["A", "B"] as Grade[]).map((g) => (
                  <button key={g} type="button" aria-pressed={grade === g} onClick={() => setGrade(g)}
                    className={cn("rounded-lg border px-3 py-2 text-left text-sm", grade === g ? "border-daun-500 bg-daun-50" : "border-tanah-200 bg-white")}>
                    <span className="block font-semibold">Grade {g}</span><span className="num text-xs text-tanah-500">{formatRupiah(GRADES[g].price)}/kg</span>
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-tanah-500 sm:col-span-2">Grade {grade}: panjang {GRADES[grade].size}, {GRADES[grade].ripe}, {GRADES[grade].defect}. Dinilai AI dari foto petani, lalu dinilai ulang saat barang Anda terima.</p>
            <Field label="Volume paket (kg)" className="sm:col-span-2">
              <Input type="number" min={100} step={50} required value={kg} onChange={(e) => setKg(e.target.value)} />
              <span className="mt-2 flex gap-2">
                {PRESETS.map((p) => (
                  <button key={p} type="button" onClick={() => setKg(String(p))} className={cn("num h-8 rounded-full border px-3 text-xs font-medium", n === p ? "border-daun-500 bg-daun-50 text-daun-800" : "border-tanah-200 text-tanah-600")}>{formatKg(p)}</button>
                ))}
              </span>
            </Field>
          </div>
        </section>
        <section className="mt-8 border-t border-line pt-8">
          <h2 className="text-base font-semibold">Pengiriman</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Tanggal diterima"><Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} /></Field>
            <Field label="Lokasi pengiriman" className="sm:col-span-2"><Input required value={place} onChange={(e) => setPlace(e.target.value)} /></Field>
          </div>
        </section>
      </form>

      <aside className="surface-raised p-6 lg:sticky lg:top-8">
        <h2 className="text-lg font-semibold">Perkiraan paket Anda</h2>
        <dl className="mt-4 divide-y divide-line text-sm">
          {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-3"><dt className="text-tanah-500">{k}</dt><dd className="num text-right font-medium">{v}</dd></div>)}
          <div className="flex justify-between gap-4 py-3"><dt className="font-semibold">Total estimasi</dt><dd className="num text-right font-bold text-daun-700">{formatRupiah(q.buyerTotal)}</dd></div>
        </dl>
        {plan.shortKg > 0 && (
          <p role="alert" className="mt-3 rounded-lg border border-kunyit-200 bg-kunyit-50 p-3 text-sm text-kunyit-700">
            Pasokan petani terlatih yang tersedia untuk tanggal ini baru {formatKg(done)}. Kurangi volume atau mundurkan tanggal.
          </p>
        )}
        <Button type="submit" form="package-form" variant="accent" size="lg" className="mt-5 w-full" disabled={done <= 0}>Lihat alokasi pasokan</Button>
        <p className="mt-3 text-xs text-tanah-500">Hanya petani yang lulus pelatihan yang ikut dialokasikan.</p>
      </aside>
    </div>
  );
}
