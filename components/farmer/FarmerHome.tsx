"use client";

import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { GradeBadge } from "@/components/GradeBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTrained } from "@/components/farmer/useTrained";
import { FARMERS, GRADES, PERSONA_ID, qualityScore, type Grade } from "@/data/agri";
import { cn, formatRupiah } from "@/lib/utils";

export function FarmerHome() {
  const { ready, trained, set } = useTrained();
  const me = FARMERS.find((f) => f.id === PERSONA_ID)!;
  if (!ready) return <div className="h-[600px]" />;

  return (
    <div>
      <p className="text-sm text-tanah-500">Selamat pagi, Pak Dono</p>
      <h1 className="text-2xl font-bold">Kelompok Tani Cintakarya</h1>
      <p className="text-sm text-tanah-500">Samarang, Garut</p>

      {!trained ? (
        <section className="mt-4 rounded-xl border border-kunyit-200 bg-kunyit-50 p-4">
          <div className="flex items-center gap-2 font-semibold"><Lock className="h-5 w-5 text-kunyit-700" />Pasokan dan pesanan terkunci</div>
          <p className="mt-1.5 text-sm text-tanah-700">Selesaikan 4 modul dan kuis akhir (nilai minimal 70) untuk membuka katalog dan menerima pesanan.</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white"><div className="h-full w-2/5 rounded-full bg-daun-600" /></div>
          <p className="num mt-1 text-xs text-tanah-600">2 dari 5 langkah selesai</p>
          <Link href="/farmer/pelatihan" className={cn(buttonVariants({ variant: "primary" }), "mt-3 w-full")}>Lanjut belajar</Link>
        </section>
      ) : (
        <>
          <section className="mt-4 rounded-xl bg-tanah-900 p-4 text-white">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-kunyit-400 px-2 py-1 text-xs font-bold text-tanah-950"><ShieldCheck className="h-3.5 w-3.5" />Petani Terlatih</span>
              <span className="text-xs text-tanah-300">Skor Mutu Digital</span>
            </div>
            <p className="num mt-3 font-display text-5xl font-bold">{qualityScore(me.c)}</p>
            <div className="mt-4"><ScoreBreakdown c={me.c} dark /></div>
          </section>
          <section className="mt-3 rounded-xl bg-daun-600 p-4 text-white">
            <p className="text-sm text-daun-100">1 pesanan baru</p>
            <p className="mt-1 text-lg font-bold">Panen kamu dipesan 200 kg cabai merah keriting</p>
            <Link href="/farmer/pesanan" className={cn(buttonVariants({ variant: "accent" }), "mt-3 w-full")}>Lihat pesanan</Link>
          </section>
        </>
      )}

      <h2 className="mt-6 text-lg font-semibold">Harga acuan hari ini</h2>
      <p className="text-xs text-tanah-500">Cabai merah keriting per kg, simulasi</p>
      <ul className="surface mt-3 divide-y divide-line">
        {(Object.keys(GRADES) as Grade[]).map((g) => (
          <li key={g} className="flex items-center justify-between gap-3 px-4 py-3">
            <div><GradeBadge grade={g} /><p className="mt-1 text-xs text-tanah-500">{GRADES[g].size}, {GRADES[g].ripe}</p></div>
            <p className="num font-semibold">{formatRupiah(GRADES[g].price)}</p>
          </li>
        ))}
      </ul>
      <Button variant="ghost" size="sm" className="mt-4 w-full text-tanah-500" onClick={() => set(false)}>Atur ulang demo pelatihan</Button>
    </div>
  );
}
