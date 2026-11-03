"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Star } from "lucide-react";
import { GradeBadge } from "@/components/GradeBadge";
import { StepTimeline } from "@/components/StepTimeline";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { DEMO_PACKAGE, GRADES, RULES, adjust, allocate, quote, type Grade } from "@/data/agri";
import { cn, formatKg, formatRupiah, formatTanggal } from "@/lib/utils";

const STEPS = ["Dibayar ke escrow", "Petani diberi tahu", "Dinilai AI dan dikemas", "Dijemput dan dikirim", "Diterima dan diverifikasi", "Dana cair"];
const METHODS = ["Virtual account bank", "QRIS", "Transfer bank"];
const REVIEW_THRESHOLD_PCT = 5; // selisih harga di atas ini otomatis masuk antrean peninjauan admin
type Verify = "belum" | "menilai" | "hasil" | "setuju" | "sengketa";

const addDays = (iso: string, d: number) => { const t = new Date(iso + "T00:00:00Z"); t.setUTCDate(t.getUTCDate() + d); return t.toISOString().slice(0, 10); };

export function OrderView({ kg, grade, date }: { kg: number; grade: Grade; date: string }) {
  const plan = useMemo(() => allocate(kg, date), [kg, date]);
  const q = useMemo(() => quote(kg, grade, plan.allocs), [kg, grade, plan]);
  const [current, setCurrent] = useState(0);
  const [method, setMethod] = useState(METHODS[0]);
  const [verify, setVerify] = useState<Verify>("belum");
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [rated, setRated] = useState(false);

  const lower: Grade = grade === "A" ? "B" : "C";
  const topKg = grade === "C" ? kg : Math.floor((kg * 0.92) / 10) * 10;
  const actual: Record<Grade, number> = { A: 0, B: 0, C: 0 };
  actual[grade] = topKg;
  actual[lower] += kg - topKg;
  const adj = adjust(actual, grade);
  const ratio = adj.actualValue / adj.promisedValue;
  const diffPct = Math.abs(adj.diff) / adj.promisedValue * 100;
  const feeBuyerF = Math.round((adj.actualValue * RULES.feeBuyerPct) / 100);
  const feeFarmerF = Math.round((adj.actualValue * RULES.feeFarmerPct) / 100);
  const netF = adj.actualValue - feeFarmerF;
  const totalF = adj.actualValue + feeBuyerF + q.logistics;
  const refund = q.buyerTotal - totalF;
  const verified = verify === "hasil" || verify === "setuju";

  const dates = [addDays(date, -10), addDays(date, -10), addDays(date, -2), addDays(date, -1), date, addDays(date, 2)];
  const steps = STEPS.map((label, i) => ({ key: String(i), label, date: i < current ? dates[i] : undefined }));
  const split = verified
    ? [{ l: "Ke petani", v: netF, c: "bg-daun-600" }, { l: "Komisi platform", v: feeBuyerF + feeFarmerF, c: "bg-kunyit-400" }, { l: "Logistik", v: q.logistics, c: "bg-tanah-300" }]
    : [{ l: "Ke petani", v: q.farmersNet, c: "bg-daun-600" }, { l: "Komisi platform", v: q.platform, c: "bg-kunyit-400" }, { l: "Logistik", v: q.logistics, c: "bg-tanah-300" }];
  const splitTotal = split.reduce((s, x) => s + x.v, 0);
  const pay = verified ? totalF : q.buyerTotal;
  const orderNo = DEMO_PACKAGE.id.replace("PKG", "ORD");

  const assess = () => { setVerify("menilai"); setTimeout(() => setVerify("hasil"), 1600); };
  const canAdvance = (current >= 1 && current <= 3) || current === 5;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        <section className="surface p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-semibold">Cabai merah keriting, {formatKg(kg)}</h2><GradeBadge grade={grade} /></div>
            <Link href={`/buyer/requests/1?kg=${kg}&grade=${grade}&tgl=${date}`} className="text-sm font-medium text-daun-700 hover:underline">Lihat alokasi petani</Link>
          </div>
          <dl className="mt-4 divide-y divide-line text-sm">
            {([["Nomor pesanan", orderNo], ["Diterima", formatTanggal(date)], ["Tujuan", `${DEMO_PACKAGE.buyer}, ${DEMO_PACKAGE.city}`], ["Pemasok", `${plan.allocs.length} petani dari ${new Set(plan.allocs.map((a) => a.farmer.group)).size} kelompok, jarak rata-rata ${q.avgKm.toFixed(1).replace(".", ",")} km`]] as const).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-2.5"><dt className="shrink-0 text-tanah-500">{k}</dt><dd className="num text-right font-medium">{v}</dd></div>
            ))}
          </dl>
        </section>

        <section className="surface p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Pembayaran escrow</h2>
            {current > 0 ? <Badge tone="success"><Check className="h-3.5 w-3.5" strokeWidth={3} />Dana ditahan</Badge> : <Badge tone="warning">Menunggu pembayaran</Badge>}
          </div>
          {current === 0 ? (
            <>
              <p className="mt-1 text-sm text-tanah-500">Dana ditahan lewat payment gateway berizin dan baru cair ke petani setelah Anda mengonfirmasi penerimaan.</p>
              <fieldset className="mt-4 space-y-2">
                <legend className="sr-only">Metode pembayaran</legend>
                {METHODS.map((m) => (
                  <label key={m} className={cn("flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm", method === m ? "border-daun-500 bg-daun-50" : "border-tanah-200")}>
                    <input type="radio" name="method" className="accent-[#1B6B4A]" checked={method === m} onChange={() => setMethod(m)} />{m}
                  </label>
                ))}
              </fieldset>
              <Button variant="accent" size="lg" className="num mt-5 w-full sm:w-auto" onClick={() => setCurrent(1)}>Bayar {formatRupiah(q.buyerTotal)}</Button>
            </>
          ) : (
            <p className="num mt-2 text-sm text-tanah-600">{formatRupiah(q.buyerTotal)} dibayar lewat {method} pada {formatTanggal(dates[0])}. Dana akan dicairkan 1 sampai 2 hari setelah penerimaan Anda konfirmasi.</p>
          )}
        </section>

        <section className="surface p-6 lg:p-8">
          <h2 className="text-xl font-semibold">Status pesanan</h2>
          <StepTimeline steps={steps} current={current} className="mt-8 hidden md:flex" />
          <StepTimeline steps={steps} current={current} orientation="vertical" className="mt-6 md:hidden" />
          {canAdvance && (
            <div className="mt-6 border-t border-line pt-5">
              <Button variant="outline" size="sm" onClick={() => setCurrent((c) => c + 1)}>Majukan status (simulasi)</Button>
              {current === 1 && <p className="mt-2 text-xs text-tanah-500">Petani menerima notifikasi WhatsApp dan aplikasi, lalu menyortir dan memotret hasil panen.</p>}
            </div>
          )}
        </section>

        {current === 4 && (
          <section className="surface p-6 lg:p-8">
            <h2 className="text-xl font-semibold">Verifikasi penerimaan</h2>
            <p className="mt-1 text-sm text-tanah-500">Foto barang dalam {RULES.receiveWindowHours} jam setelah tiba (tersisa 9 jam 40 menit). AI menilai ulang, dan harga disesuaikan dengan grade aktual sebelum dana cair.</p>
            <div className="relative mt-4 aspect-[20/9] max-w-md overflow-hidden rounded-xl bg-tanah-100">
              <Image src="/images/cabai.jpg" alt="Foto contoh barang saat diterima" fill sizes="448px" className="object-cover" />
              {verify === "menilai" && <div className="absolute inset-0 grid place-items-center bg-tanah-950/55 text-sm font-semibold text-white">AI sedang menilai ulang…</div>}
            </div>
            <p className="mt-2 text-xs text-tanah-500">Foto contoh untuk demo. Penilaian AI pada prototype ini simulasi.</p>
            {verify === "belum" && <Button className="mt-4" variant="accent" onClick={assess}>Kirim foto dan nilai ulang dengan AI</Button>}

            {(verify === "hasil" || verify === "sengketa") && (
              <div className="mt-5">
                <dl className="num divide-y divide-line text-sm">
                  <div className="flex justify-between py-2.5"><dt className="text-tanah-500">Dijanjikan</dt><dd className="font-medium">{formatKg(kg)} Grade {grade}</dd></div>
                  {(["A", "B", "C"] as Grade[]).filter((g) => actual[g] > 0).map((g) => (
                    <div key={g} className="flex justify-between py-2.5"><dt className="text-tanah-500">Hasil penilaian ulang</dt><dd className="font-medium">{formatKg(actual[g])} Grade {g} ({Math.round((actual[g] / kg) * 100)}%)</dd></div>
                  ))}
                  <div className="flex justify-between py-2.5"><dt className="text-tanah-500">Nilai sesuai grade aktual</dt><dd className="font-medium">{formatRupiah(adj.actualValue)}</dd></div>
                  <div className="flex justify-between py-2.5"><dt className="font-semibold">Penyesuaian harga otomatis</dt><dd className="font-bold text-cabai-600">{adj.diff === 0 ? "Tidak ada" : "− " + formatRupiah(Math.abs(adj.diff))}</dd></div>
                </dl>
                <p className="num mt-2 text-xs text-tanah-500">Selisih {diffPct.toFixed(1).replace(".", ",")}% dari nilai pesanan, di bawah cadangan penyesuaian {RULES.adjustmentReservePct}% dan batas peninjauan admin {REVIEW_THRESHOLD_PCT}%. Keyakinan AI 90%, simulasi.</p>
                {verify === "hasil" ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button variant="primary" onClick={() => { setVerify("setuju"); setCurrent(5); }}>Setuju, cairkan dana</Button>
                    <Button variant="outline" onClick={() => setVerify("sengketa")}>Ajukan peninjauan</Button>
                  </div>
                ) : (
                  <p role="status" className="mt-4 rounded-lg border border-kunyit-200 bg-kunyit-50 p-3 text-sm text-kunyit-700">
                    Penilaian Anda dicatat dan masuk antrean peninjauan admin. Dana tetap ditahan sampai ada keputusan. <Link href="/admin" className="font-semibold underline">Lihat antrean admin</Link>
                  </p>
                )}
              </div>
            )}
          </section>
        )}

        {verify === "setuju" && (
          <section className="surface p-6 lg:p-8">
            <h2 className="text-xl font-semibold">Pembayaran ke petani</h2>
            <p className="mt-1 text-sm text-tanah-500">Dibagi otomatis sesuai kontribusi dan grade, setelah komisi {RULES.feeFarmerPct}%.{current >= 6 ? " Dana sudah cair." : " Cair dalam 1 sampai 2 hari."}</p>
            <ul className="mt-4 divide-y divide-line text-sm">
              {plan.allocs.map((a) => (
                <li key={a.farmer.id} className="flex justify-between gap-4 py-2.5"><span>{a.farmer.name} <span className="num text-tanah-500">({formatKg(a.kg)})</span></span><span className="num font-medium">{formatRupiah(Math.round(a.kg * GRADES[grade].price * ratio * (1 - RULES.feeFarmerPct / 100)))}</span></li>
              ))}
            </ul>
            {refund > 0 && <p className="num mt-3 text-sm text-tanah-600">Selisih escrow {formatRupiah(refund)} dikembalikan ke pembeli.</p>}
          </section>
        )}

        {current >= 6 && (
          <section className="surface p-6 lg:p-8">
            <h2 className="text-xl font-semibold">Nilai transaksi ini</h2>
            <p className="mt-1 text-sm text-tanah-500">Hanya pembeli dengan transaksi terverifikasi yang dapat menilai. Rating ikut membentuk reputasi petani.</p>
            {rated ? (
              <p role="status" className="mt-4 rounded-lg bg-daun-50 p-3 text-sm text-daun-900">Terima kasih, penilaian Anda tersimpan.</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (stars) setRated(true); }} className="mt-4 space-y-3">
                <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" aria-label={`${n} bintang`} aria-checked={stars === n} role="radio" onClick={() => setStars(n)}>
                      <Star className={cn("h-8 w-8", n <= stars ? "fill-kunyit-400 text-kunyit-400" : "text-tanah-300")} />
                    </button>
                  ))}
                </div>
                <Textarea aria-label="Ulasan" placeholder="Tulis ulasan singkat (opsional)" value={comment} onChange={(e) => setComment(e.target.value)} />
                <Button type="submit" disabled={!stars}>Kirim penilaian</Button>
              </form>
            )}
          </section>
        )}
      </div>

      <aside className="surface-raised overflow-hidden lg:sticky lg:top-8">
        <div className="p-6">
          <h2 className="text-base font-semibold text-tanah-700">{verified ? "Total akhir setelah penyesuaian" : "Total dibayar ke escrow"}</h2>
          <p className="num mt-1 font-display text-4xl font-bold text-daun-700">{formatRupiah(pay)}</p>
          <div role="img" aria-label="Pembagian dana" className="mt-5 flex h-3 gap-0.5 overflow-hidden rounded-full">
            {split.map((s) => <span key={s.l} className={s.c} style={{ width: `${(s.v / splitTotal) * 100}%` }} />)}
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {split.map((s) => <li key={s.l} className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-tanah-600"><span className={cn("h-2 w-2 rounded-sm", s.c)} />{s.l}</span><span className="num font-medium">{formatRupiah(s.v)}</span></li>)}
          </ul>
          <dl className="num mt-5 divide-y divide-line border-t border-line text-sm">
            {([[`Nilai pasokan Grade ${grade}`, formatRupiah(verified ? adj.actualValue : q.gross)], [`Biaya layanan pembeli ${RULES.feeBuyerPct}%`, formatRupiah(verified ? feeBuyerF : q.feeBuyer)], [`Komisi petani ${RULES.feeFarmerPct}%`, formatRupiah(verified ? feeFarmerF : q.feeFarmer)], ["Ongkos kirim", formatRupiah(q.logistics)]] as const).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-tanah-500">{k}</dt><dd className="font-medium">{v}</dd></div>
            ))}
          </dl>
        </div>
        {verified && refund > 0 && <p className="num border-t border-line bg-tanah-50 px-6 py-4 text-sm text-tanah-600">Dikembalikan ke pembeli dari escrow: <b className="text-tanah-900">{formatRupiah(refund)}</b></p>}
      </aside>
    </div>
  );
}
