"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { getGroup, qcBatch, type StatusKey } from "@/data/dummy";
import { cn, formatKg, formatTanggal } from "@/lib/utils";

const RESOLUTIONS = ["Sortir ulang oleh kelompok tani", "Penggantian barang", "Kurangi jumlah barang yang diterima"];

export function QcForm() {
  const group = getGroup(qcBatch.groupId);
  const [checked, setChecked] = useState(String(qcBatch.checkedKg));
  const [failed, setFailed] = useState(String(qcBatch.failedKg));
  const [params, setParams] = useState(qcBatch.params);
  const [resolution, setResolution] = useState(RESOLUTIONS[0]);
  const [note, setNote] = useState("Tanah menempel pada sebagian karung. Dipisahkan untuk disortir ulang.");
  const [saved, setSaved] = useState(false);

  const total = Math.max(0, Number(checked) || 0);
  const bad = Math.min(total, Math.max(0, Number(failed) || 0));
  const good = total - bad;
  const pct = total ? Math.round((good / total) * 100) : 0;
  const status: StatusKey = bad === 0 ? "lolos" : bad >= total && total > 0 ? "tidak_lolos" : "lolos_sebagian";
  const mismatch = bad > 0 || params.some((p) => !p.pass);
  const setParam = (i: number, patch: Partial<(typeof params)[number]>) => setParams((ps) => ps.map((p, j) => (j === i ? { ...p, ...patch } : p)));

  const info: [string, string][] = [
    ["Pesanan", qcBatch.orderId],
    ["Kelompok tani", `${group.name}, ${group.village}`],
    ["Lokasi", qcBatch.location],
    ["Tanggal", formatTanggal(qcBatch.date)],
    ["Petugas", qcBatch.inspector],
  ];

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
      <form id="qc-form" onSubmit={(e) => { e.preventDefault(); setSaved(true); }} className="surface divide-y divide-line">
        <section className="p-6 lg:p-8">
          <p className="text-sm text-tanah-500">Nomor batch</p>
          <p className="num font-display text-3xl font-bold">{qcBatch.id}</p>
          <dl className="mt-4 divide-y divide-line text-sm">
            {info.map(([k, v]) => <div key={k} className="flex justify-between gap-6 py-2.5"><dt className="text-tanah-500">{k}</dt><dd className="num text-right font-medium">{v}</dd></div>)}
          </dl>
        </section>

        <section className="p-6 lg:p-8">
          <h2 className="text-lg font-semibold">Volume</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Volume diperiksa (kg)"><Input type="number" min={0} required value={checked} onChange={(e) => setChecked(e.target.value)} /></Field>
            <Field label="Volume tidak lolos (kg)" hint={`Volume lolos otomatis: ${formatKg(good)}`}><Input type="number" min={0} required value={failed} onChange={(e) => setFailed(e.target.value)} /></Field>
          </div>
        </section>

        <section className="p-6 lg:p-8">
          <h2 className="text-lg font-semibold">Hasil pengukuran</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {params.map((p, i) => (
              <li key={p.name} className="grid gap-3 py-4 md:grid-cols-[1.2fr_1fr_auto] md:items-center">
                <div><p className="font-medium">{p.name}</p><p className="text-sm text-tanah-500">Standar: {p.standard}</p></div>
                <Input aria-label={`Hasil ${p.name}`} value={p.result} onChange={(e) => setParam(i, { result: e.target.value })} />
                <div className="inline-flex rounded-lg border border-tanah-200 p-0.5">
                  <button type="button" aria-pressed={p.pass} onClick={() => setParam(i, { pass: true })} className={cn("h-9 rounded-md px-3 text-sm font-medium", p.pass ? "bg-daun-600 text-white" : "text-tanah-600")}>Sesuai</button>
                  <button type="button" aria-pressed={!p.pass} onClick={() => setParam(i, { pass: false })} className={cn("h-9 rounded-md px-3 text-sm font-medium", !p.pass ? "bg-cabai-500 text-white" : "text-tanah-600")}>Tidak sesuai</button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-6 lg:p-8">
          <h2 className="text-lg font-semibold">Foto produk</h2>
          <p className="mt-1 text-sm text-tanah-500">Foto contoh untuk keperluan demo.</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {["/images/petani.jpg", "/images/ladang.jpg"].map((src) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-lg"><Image src={src} alt="Foto produk saat pemeriksaan" fill sizes="160px" className="object-cover" /></div>
            ))}
            <div className="grid aspect-[4/3] place-items-center rounded-lg border-2 border-dashed border-tanah-200 text-sm text-tanah-500"><span className="flex items-center gap-1.5"><Plus className="h-4 w-4" />Tambah foto</span></div>
          </div>
        </section>

        <section className="p-6 lg:p-8">
          <h2 className="text-lg font-semibold">{mismatch ? "Penanganan ketidaksesuaian" : "Catatan pemeriksaan"}</h2>
          <div className="mt-4 grid gap-4">
            {mismatch && (
              <Field label="Usulan penyelesaian" hint="Keputusan akhir perlu disetujui pembeli dan kelompok tani. Sistem tidak memotong pembayaran otomatis.">
                <Select value={resolution} onChange={(e) => setResolution(e.target.value)}>{RESOLUTIONS.map((r) => <option key={r}>{r}</option>)}</Select>
              </Field>
            )}
            <Field label="Catatan"><Textarea value={note} onChange={(e) => setNote(e.target.value)} /></Field>
          </div>
        </section>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-8">
        <section className="surface-raised p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Hasil pemeriksaan</h2>
            <StatusBadge status={status} />
          </div>
          <p className="num mt-4 font-display text-4xl font-bold text-daun-700">{pct}%</p>
          <p className="text-sm text-tanah-500">volume lolos</p>
          <div role="img" aria-label={`${pct}% lolos`} className="mt-4 flex h-3 gap-0.5 overflow-hidden rounded-full bg-tanah-100">
            <span className="bg-daun-600" style={{ width: `${pct}%` }} />
            <span className="bg-cabai-500" style={{ width: `${total ? 100 - pct : 0}%` }} />
          </div>
          <dl className="num mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-tanah-500">Lolos</dt><dd className="font-medium">{formatKg(good)}</dd></div>
            <div className="flex justify-between"><dt className="text-tanah-500">Tidak lolos</dt><dd className="font-medium">{formatKg(bad)}</dd></div>
          </dl>
          <Button type="submit" form="qc-form" variant="accent" size="lg" className="mt-5 w-full">Simpan hasil pemeriksaan</Button>
          {saved && (
            <p role="status" className="mt-3 rounded-lg bg-daun-50 p-3 text-sm text-daun-900">
              Hasil batch {qcBatch.id} tersimpan dan terhubung ke pesanan.{" "}
              <Link href="/orders/1" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-auto px-0 font-semibold text-daun-700 hover:bg-transparent")}>Lihat pesanan</Link>
            </p>
          )}
        </section>

        <section className="surface p-6">
          <h2 className="text-base font-semibold">Jejak batch</h2>
          <ol className="mt-3 divide-y divide-line text-sm">
            {[["Kelompok tani", group.name], ["Pesanan", qcBatch.orderId], ["Batch", qcBatch.id], ["Diperiksa", `${qcBatch.inspector}, ${formatTanggal(qcBatch.date)}`], ["Berikutnya", "Pengiriman dan penerimaan pembeli"]].map(([k, v]) => (
              <li key={k} className="flex justify-between gap-4 py-2.5"><span className="text-tanah-500">{k}</span><span className="num text-right font-medium">{v}</span></li>
            ))}
          </ol>
        </section>
      </aside>
    </div>
  );
}
