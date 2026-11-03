"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { GradeBadge } from "@/components/GradeBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DEMO_PACKAGE, FARMERS, PERSONA_ID, qualityScore } from "@/data/agri";
import { cn, formatTanggal } from "@/lib/utils";

type Stage = "siap" | "menilai" | "ditolak" | "hasil" | "terkirim";

const CHECKLIST = [
  "Cabai sudah disortir sesuai modul",
  "Tidak ada buah busuk atau berjamur",
  "Kemasan bersih dan kering",
  "Foto diambil siang hari, tanpa filter",
];
const METRICS = [
  ["Panjang rata-rata", "13,2 cm", "Standar 12–15 cm"],
  ["Kematangan warna", "Merah 93%", "Standar min. 90%"],
  ["Cacat fisik", "2,1%", "Standar maks. 3%"],
  ["Kualitas foto", "Baik", "Terang, fokus, lokasi dan waktu tercatat"],
];

export function Grading() {
  const [stage, setStage] = useState<Stage>("siap");
  const [blur, setBlur] = useState(false);
  const [checks, setChecks] = useState<boolean[]>(CHECKLIST.map(() => false));
  const me = FARMERS.find((f) => f.id === PERSONA_ID)!;

  const assess = () => {
    setStage("menilai");
    setTimeout(() => setStage(blur ? "ditolak" : "hasil"), 1600);
  };

  return (
    <div>
      <Link href="/farmer/pesanan" className="inline-flex items-center gap-1.5 py-1 text-sm font-medium text-tanah-600"><ArrowLeft className="h-4 w-4" />Pesanan</Link>
      <h1 className="mt-1 text-2xl font-bold">Foto dan nilai hasil panen</h1>

      {stage === "terkirim" ? (
        <>
          <section className="mt-4 rounded-xl bg-tanah-900 p-5 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-kunyit-400 px-2 py-1 text-xs font-bold text-tanah-950"><ShieldCheck className="h-3.5 w-3.5" />Digital Quality Badge</span>
            <p className="mt-3 font-display text-3xl font-bold">Grade A terverifikasi</p>
            <p className="num mt-1 text-sm text-tanah-300">Batch BTH-CMK-0001, 200 kg</p>
            <p className="num mt-4 text-sm text-tanah-300">Skor Mutu Digital <span className="ml-1 font-display text-2xl font-bold text-white">{qualityScore(me.c)}</span></p>
          </section>
          <p role="status" className="mt-4 rounded-lg bg-daun-50 p-3 text-sm text-daun-900">Penilaian terkirim. Barang dijemput {formatTanggal(DEMO_PACKAGE.pickupDate)} pukul 07.00 di titik kumpul Samarang.</p>
          <Link href="/farmer/pesanan" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-4 w-full")}>Kembali ke pesanan</Link>
        </>
      ) : (
        <>
          <div className="relative mt-4 aspect-[20/9] overflow-hidden rounded-xl bg-tanah-100">
            <Image src="/images/cabai.jpg" alt="Foto contoh hasil panen cabai" fill sizes="340px" className={cn("object-cover transition", blur && "scale-110 blur-md")} />
            {stage === "menilai" && <div className="absolute inset-0 grid place-items-center bg-tanah-950/55 text-sm font-semibold text-white">AI sedang menilai foto…</div>}
          </div>
          <p className="mt-2 text-xs text-tanah-500">Foto contoh untuk demo. Penilaian AI pada prototype ini simulasi.</p>

          {(stage === "siap" || stage === "ditolak") && (
            <>
              <div className="mt-3 inline-flex rounded-lg border border-tanah-200 p-0.5 text-sm">
                {([["Foto jelas", false], ["Foto buram", true]] as const).map(([l, b]) => (
                  <button key={l} type="button" aria-pressed={blur === b} onClick={() => { setBlur(b); setStage("siap"); }} className={cn("h-9 rounded-md px-3 font-medium", blur === b ? "bg-daun-600 text-white" : "text-tanah-600")}>{l}</button>
                ))}
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-tanah-600">
                <li>Foto di tempat terang, latar polos</li><li>Satu batch dalam satu foto, tidak buram</li>
              </ul>
              {stage === "ditolak" && <p role="alert" className="mt-3 rounded-lg border border-cabai-100 bg-cabai-50 p-3 text-sm text-cabai-700">Foto ditolak otomatis karena buram. Ambil ulang di tempat yang lebih terang.</p>}
              <Button size="lg" variant="accent" className="mt-4 w-full" onClick={assess}>Nilai dengan AI</Button>
            </>
          )}

          {stage === "hasil" && (
            <>
              <section className="surface mt-4 p-4">
                <div className="flex items-center justify-between"><p className="text-sm text-tanah-500">Hasil penilaian AI</p><span className="num text-xs text-tanah-500">Keyakinan 92%</span></div>
                <div className="mt-2 flex items-center gap-3"><GradeBadge grade="A" className="h-9 min-w-[5rem] text-sm" /><p className="text-sm text-tanah-700">Sesuai pesanan Grade A</p></div>
                <dl className="mt-3 divide-y divide-line text-sm">
                  {METRICS.map(([k, v, s]) => (
                    <div key={k} className="flex justify-between gap-3 py-2"><dt><span className="text-tanah-700">{k}</span><span className="block text-xs text-tanah-500">{s}</span></dt><dd className="num shrink-0 font-semibold text-daun-700">{v}</dd></div>
                  ))}
                </dl>
              </section>
              <section className="mt-4">
                <h2 className="text-base font-semibold">Checklist petani</h2>
                <p className="text-xs text-tanah-500">Dipakai bersama foto karena kualitas kamera tiap HP berbeda.</p>
                <div className="mt-2 space-y-2">
                  {CHECKLIST.map((c, i) => (
                    <label key={c} className={cn("flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm", checks[i] ? "border-daun-500 bg-daun-50" : "border-tanah-200 bg-white")}>
                      <input type="checkbox" className="h-4 w-4 accent-[#1B6B4A]" checked={checks[i]} onChange={() => setChecks((x) => x.map((v, k) => (k === i ? !v : v)))} />{c}
                    </label>
                  ))}
                </div>
              </section>
              <Button size="lg" variant="accent" className="mt-4 w-full" disabled={!checks.every(Boolean)} onClick={() => setStage("terkirim")}>Kirim penilaian</Button>
            </>
          )}
        </>
      )}
    </div>
  );
}
