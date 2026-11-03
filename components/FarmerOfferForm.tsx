"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { SERVICE_FEE_PCT, farmerSupply, order } from "@/data/dummy";
import { cn, formatKg, formatRupiah, formatTanggal } from "@/lib/utils";

type Req = { id: string; buyer: string; city: string; commodity: string; volumeKg: number; deliveryDate: string };

export function FarmerOfferForm({ request }: { request: Req }) {
  const available = farmerSupply.confirmedKg - farmerSupply.allocatedKg;
  const [volume, setVolume] = useState("2000");
  const [price, setPrice] = useState("11500");
  const [ready, setReady] = useState("2026-12-12");
  const [pickup, setPickup] = useState("Cikajang, titik kumpul Gapoktan");
  const [quality, setQuality] = useState("Sesuai semua parameter");
  const [note, setNote] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [sent, setSent] = useState(false);

  const vol = Number(volume) || 0;
  const gross = vol * (Number(price) || 0);
  const fee = Math.round((gross * SERVICE_FEE_PCT) / 100);
  const net = Math.max(0, gross - fee - (gross > 0 ? order.qcFee : 0));
  const over = vol > available;

  if (sent)
    return (
      <div className="px-4 pt-6 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-daun-600 text-white"><Check className="h-7 w-7" strokeWidth={3} /></span>
        <h1 className="mt-4 text-2xl font-bold">Penawaran terkirim</h1>
        <p className="mt-1.5 text-sm text-tanah-600">{request.buyer} akan membandingkannya dengan penawaran lain.</p>
        <dl className="surface num mt-6 divide-y divide-line px-4 text-left text-sm">
          {([["Permintaan", request.commodity], ["Volume", formatKg(vol)], ["Harga per kg", formatRupiah(Number(price) || 0)], ["Perkiraan diterima", formatRupiah(net)]] as const).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-3"><dt className="text-tanah-500">{k}</dt><dd className="font-medium">{v}</dd></div>
          ))}
        </dl>
        <StatusBadge status="dikirim_penawaran" className="mt-4" />
        <Link href="/farmer" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-6 w-full")}>Kembali ke papan permintaan</Link>
      </div>
    );

  return (
    <form onSubmit={(e) => { e.preventDefault(); over ? setConfirm(true) : setSent(true); }} className="flex min-h-full flex-col">
      <div className="flex-1 px-4 pt-1">
        <Link href="/farmer" className="inline-flex items-center gap-1.5 py-1 text-sm font-medium text-tanah-600"><ArrowLeft className="h-4 w-4" />Papan permintaan</Link>
        <h1 className="mt-1 text-2xl font-bold">Ajukan penawaran</h1>

        <div className="surface mt-4 p-3.5 text-sm">
          <p className="font-semibold">{request.commodity}</p>
          <p className="num mt-0.5 text-tanah-600">Butuh {formatKg(request.volumeKg)} · kirim {formatTanggal(request.deliveryDate)}</p>
          <p className="mt-0.5 text-tanah-500">{request.buyer}, {request.city}</p>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Volume yang sanggup dipasok (kg)" hint={`Pasokan terkonfirmasi tersedia ${formatKg(available)}`}>
            <Input type="number" min={1} required value={volume} onChange={(e) => setVolume(e.target.value)} />
          </Field>
          {over && (
            <p role="alert" className="rounded-lg border border-kunyit-200 bg-kunyit-50 p-3 text-sm text-kunyit-700">
              Volume ini melebihi pasokan terkonfirmasi Anda. Kurangi volume atau perbarui data pasokan.
            </p>
          )}
          <Field label="Harga per kg (Rp)"><Input type="number" min={1} required value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
          <Field label="Perkiraan tanggal siap"><Input type="date" required value={ready} onChange={(e) => setReady(e.target.value)} /></Field>
          <Field label="Lokasi pengumpulan"><Input required value={pickup} onChange={(e) => setPickup(e.target.value)} /></Field>
          <Field label="Kesesuaian standar kualitas">
            <Select value={quality} onChange={(e) => setQuality(e.target.value)}>
              <option>Sesuai semua parameter</option><option>Sesuai, sebagian perlu disortir</option><option>Belum pasti, perlu pemeriksaan petugas</option>
            </Select>
          </Field>
          <Field label="Catatan (opsional)"><Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Misalnya kondisi panen" /></Field>
        </div>

        <section className="mt-6 rounded-xl bg-daun-50 p-4">
          <p className="text-sm text-daun-900/80">Perkiraan diterima kelompok</p>
          <p className="num font-display text-3xl font-bold text-daun-700">{formatRupiah(net)}</p>
          <dl className="num mt-3 space-y-1.5 border-t border-daun-200 pt-3 text-sm text-daun-900/80">
            <div className="flex justify-between"><dt>Nilai penawaran</dt><dd>{formatRupiah(gross)}</dd></div>
            <div className="flex justify-between"><dt>Biaya layanan ({SERVICE_FEE_PCT}%)</dt><dd>− {formatRupiah(fee)}</dd></div>
            <div className="flex justify-between"><dt>Pemeriksaan kualitas</dt><dd>− {formatRupiah(gross > 0 ? order.qcFee : 0)}</dd></div>
          </dl>
        </section>
        <div className="h-4" />
      </div>

      <div className="sticky bottom-0 border-t border-line bg-white px-4 pb-5 pt-3">
        <Button type="submit" variant="accent" size="lg" className="w-full">Kirim penawaran</Button>
      </div>

      {confirm && (
        <div className="absolute inset-0 z-30 flex items-end bg-tanah-950/55">
          <div role="dialog" aria-modal="true" aria-labelledby="warn-title" className="w-full rounded-t-2xl bg-white p-5 pb-8">
            <h2 id="warn-title" className="text-xl font-bold">Volume melebihi pasokan</h2>
            <p className="num mt-2 text-sm text-tanah-600">
              Anda menawarkan {formatKg(vol)}, sedangkan pasokan terkonfirmasi {formatKg(available)}. Penawaran tetap bisa dikirim, tetapi pemenuhannya perlu dikonfirmasi petugas.
            </p>
            <div className="mt-5 grid gap-2">
              <Button type="button" variant="accent" size="lg" onClick={() => { setConfirm(false); setSent(true); }}>Tetap kirim</Button>
              <Button type="button" variant="outline" size="lg" onClick={() => setConfirm(false)}>Perbaiki volume</Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
