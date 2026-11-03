"use client";

import { useState } from "react";
import Image from "next/image";
import { GradeBadge } from "@/components/GradeBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/field";
import { adjust, type Grade } from "@/data/agri";
import { formatKg, formatRupiah } from "@/lib/utils";

const CASES: { id: string; pkg: string; buyer: string; group: string; promised: Grade; actual: Record<Grade, number>; reason: string }[] = [
  { id: "d1", pkg: "PKG-2612-0031", buyer: "Katering Rasa Priangan", group: "Kelompok Tani Mekar Sari", promised: "A", actual: { A: 480, B: 0, C: 320 }, reason: "Selisih di atas batas 5%" },
  { id: "d2", pkg: "PKG-2612-0042", buyer: "CV Dapur Nusantara", group: "Kelompok Tani Cintakarya", promised: "A", actual: { A: 920, B: 80, C: 0 }, reason: "Dipersoalkan pembeli" },
];
const OPTIONS = ["Terima penilaian ulang AI", "Pertahankan grade dari petani", "Minta foto tambahan"];
const stamp = () => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date());

export function DisputeQueue() {
  const [choice, setChoice] = useState<Record<string, string>>({});
  const [note, setNote] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Record<string, string>>({});
  const [log, setLog] = useState<{ text: string; time: string }[]>([]);
  const pending = CASES.filter((c) => !done[c.id]).length;

  const decide = (id: string, pkg: string) => {
    const d = choice[id] ?? OPTIONS[0];
    setDone((x) => ({ ...x, [id]: d }));
    setLog((l) => [{ text: `${pkg}: ${d}${note[id] ? ` (${note[id]})` : ""}, oleh Tim operasional`, time: stamp() }, ...l]);
  };

  return (
    <section className="surface">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line p-6">
        <div><h2 className="text-xl font-semibold">Antrean peninjauan mutu</h2><p className="mt-1 text-sm text-tanah-500">Selisih besar dan penilaian yang dipersoalkan. Dana tetap ditahan sampai ada keputusan.</p></div>
        <p className="text-sm text-tanah-500">{pending} menunggu keputusan</p>
      </div>
      <ul className="divide-y divide-line">
        {CASES.map((c) => {
          const a = adjust(c.actual, c.promised);
          const pct = (Math.abs(a.diff) / a.promisedValue) * 100;
          return (
            <li key={c.id} className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="num font-semibold">{c.pkg}</p><p className="text-sm text-tanah-500">{c.buyer}, pemasok {c.group}</p></div>
                <Badge tone={pct > 5 ? "danger" : "warning"}>{c.reason}</Badge>
              </div>
              <div className="mt-4 grid gap-5 md:grid-cols-[auto_1fr]">
                <div className="flex gap-3">
                  {[["Foto petani", "brightness-100"], ["Foto penerimaan", "brightness-90 saturate-75"]].map(([l, f]) => (
                    <figure key={l}>
                      <div className="relative aspect-[4/3] w-36 overflow-hidden rounded-lg bg-tanah-100"><Image src="/images/cabai.jpg" alt={l} fill sizes="144px" className={`object-cover ${f}`} /></div>
                      <figcaption className="mt-1 text-xs text-tanah-500">{l}</figcaption>
                    </figure>
                  ))}
                </div>
                <dl className="num divide-y divide-line text-sm">
                  <div className="flex items-center justify-between gap-3 py-2"><dt className="text-tanah-500">Dijanjikan</dt><dd className="flex items-center gap-2 font-medium">{formatKg(a.kg)} <GradeBadge grade={c.promised} /></dd></div>
                  <div className="flex items-center justify-between gap-3 py-2"><dt className="text-tanah-500">Penilaian ulang AI</dt><dd className="font-medium">{(["A", "B", "C"] as Grade[]).filter((g) => c.actual[g] > 0).map((g) => `${c.actual[g]} kg ${g}`).join(", ")}</dd></div>
                  <div className="flex items-center justify-between gap-3 py-2"><dt className="text-tanah-500">Selisih nilai</dt><dd className="font-bold text-cabai-600">− {formatRupiah(Math.abs(a.diff))} ({pct.toFixed(1).replace(".", ",")}%)</dd></div>
                </dl>
              </div>
              {done[c.id] ? (
                <p role="status" className="mt-4 rounded-lg bg-daun-50 p-3 text-sm text-daun-900">Selesai: {done[c.id]}.</p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                  <label className="block text-sm"><span className="mb-1.5 block font-medium">Keputusan</span>
                    <Select value={choice[c.id] ?? OPTIONS[0]} onChange={(e) => setChoice((x) => ({ ...x, [c.id]: e.target.value }))}>{OPTIONS.map((o) => <option key={o}>{o}</option>)}</Select>
                  </label>
                  <label className="block text-sm"><span className="mb-1.5 block font-medium">Alasan</span>
                    <Textarea className="min-h-11 py-2.5" rows={1} value={note[c.id] ?? ""} onChange={(e) => setNote((x) => ({ ...x, [c.id]: e.target.value }))} placeholder="Ringkas dan jelas" />
                  </label>
                  <Button onClick={() => decide(c.id, c.pkg)}>Simpan keputusan</Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="border-t border-line bg-tanah-50 p-6 text-sm">
        <h3 className="font-semibold">Riwayat keputusan</h3>
        {log.length === 0 ? <p className="mt-1 text-tanah-500">Belum ada keputusan. Setiap keputusan dicatat dengan waktu, pelaksana, dan alasan.</p> : (
          <ul className="mt-2 space-y-1.5">{log.map((l, i) => <li key={i} className="flex flex-wrap justify-between gap-2"><span>{l.text}</span><span className="num text-tanah-500">{l.time}</span></li>)}</ul>
        )}
      </div>
    </section>
  );
}
