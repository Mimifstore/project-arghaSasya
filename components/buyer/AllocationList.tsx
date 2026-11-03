"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { GradeBadge } from "@/components/GradeBadge";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { SHARE_COLORS } from "@/components/buyer/RouteMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { qualityScore, type Allocation, type Grade } from "@/data/agri";
import { cn, formatKg, formatTanggal } from "@/lib/utils";

const REVIEWS: Record<string, { n: number; text: string[] }> = {
  "f-euis": { n: 12, text: ["Kualitas konsisten dan pengiriman tepat waktu.", "Cabai segar, sortirnya rapi."] },
  "f-dono": { n: 9, text: ["Panen sesuai jadwal, grade sesuai pesanan."] },
  "f-asep": { n: 7, text: ["Barang bersih, selisih ukuran sangat kecil."] },
  "f-ujang": { n: 5, text: ["Pengiriman sesuai jadwal."] },
  "f-cecep": { n: 14, text: ["Volume selalu tepat, kualitas baik."] },
};
type Msg = { from: "b" | "p"; text: string };

export function AllocationList({ allocs, total, grade }: { allocs: Allocation[]; total: number; grade: Grade }) {
  const [open, setOpen] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [chats, setChats] = useState<Record<string, Msg[]>>({});

  const send = (id: string, first: string) => {
    if (!draft.trim()) return;
    const text = draft.trim();
    setChats((c) => ({ ...c, [id]: [...(c[id] ?? []), { from: "b", text }] }));
    setDraft("");
    setTimeout(() => setChats((c) => ({ ...c, [id]: [...(c[id] ?? []), { from: "p", text: `Baik, terima kasih. Saya ${first}, panen akan disortir sesuai standar Grade ${grade}.` }] })), 900);
  };

  return (
    <section className="surface">
      <div className="p-6">
        <h2 className="text-xl font-semibold">Komposisi pasokan</h2>
        <p className="mt-1 text-sm text-tanah-500">Seperti portofolio: satu paket, dibagi ke beberapa petani agar pasokan stabil.</p>
        <div role="img" aria-label="Pembagian kuota per petani" className="mt-5 flex h-4 gap-0.5 overflow-hidden rounded-full">
          {allocs.map((a, i) => <span key={a.farmer.id} style={{ width: `${(a.kg / total) * 100}%`, background: SHARE_COLORS[i % SHARE_COLORS.length] }} />)}
        </div>
      </div>
      <ul className="divide-y divide-line border-t border-line">
        {allocs.map((a, i) => {
          const f = a.farmer, rev = REVIEWS[f.id], isOpen = open === f.id, first = f.name.split(" ")[0];
          const rating = (f.c[2] / 20).toFixed(1).replace(".", ",");
          return (
            <li key={f.id}>
              <button type="button" aria-expanded={isOpen} onClick={() => { setOpen(isOpen ? null : f.id); setDraft(""); }} className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-tanah-50">
                <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: SHARE_COLORS[i % SHARE_COLORS.length] }} />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{f.name}</span>
                  <span className="block text-sm text-tanah-500">{f.group}, {f.village}</span>
                  <span className="num mt-1 block text-xs text-tanah-500">Mutu {qualityScore(f.c)} · {f.distanceKm} km ke titik kumpul · panen {formatTanggal(f.harvestDate)}</span>
                </span>
                <span className="text-right"><span className="num block font-bold">{formatKg(a.kg)}</span><span className="num block text-xs text-tanah-500">{Math.round((a.kg / total) * 100)}%</span></span>
                <ChevronDown className={cn("h-5 w-5 shrink-0 text-tanah-400 transition-transform", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <div className="grid gap-6 border-t border-line bg-tanah-50 px-6 py-5 md:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Skor Mutu Digital</h3><GradeBadge grade={grade} /></div>
                    <div className="mt-3"><ScoreBreakdown c={f.c} /></div>
                    <h3 className="mt-5 text-sm font-semibold">Ulasan pembeli terverifikasi</h3>
                    <p className="num mt-1 text-sm text-tanah-600">Rating {rating} dari 5, {rev?.n ?? 3} transaksi</p>
                    <ul className="mt-2 space-y-1 text-sm text-tanah-600">{(rev?.text ?? ["Belum ada ulasan."]).map((t) => <li key={t}>“{t}”</li>)}</ul>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-sm font-semibold">Tanya {first}</h3>
                    <div className="mt-2 min-h-24 flex-1 space-y-2 rounded-lg bg-white p-3 text-sm">
                      {(chats[f.id] ?? []).length === 0 && <p className="text-tanah-500">Tanyakan jadwal panen atau kondisi cabai sebelum memesan.</p>}
                      {(chats[f.id] ?? []).map((m, k) => <p key={k} className={cn("max-w-[85%] rounded-lg px-3 py-2", m.from === "b" ? "ml-auto bg-daun-600 text-white" : "bg-tanah-100")}>{m.text}</p>)}
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); send(f.id, first); }} className="mt-2 flex gap-2">
                      <Input aria-label={`Pesan untuk ${first}`} placeholder="Tulis pertanyaan" value={draft} onChange={(e) => setDraft(e.target.value)} />
                      <Button type="submit" size="md">Kirim</Button>
                    </form>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
