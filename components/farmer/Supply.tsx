"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Locked } from "@/components/farmer/Locked";
import { useTrained } from "@/components/farmer/useTrained";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { RULES } from "@/data/agri";
import { formatKg } from "@/lib/utils";

const ESTIMATE = 1000;
const MAX = Math.round((ESTIMATE * RULES.maxPortionPct) / 100);

export function Supply() {
  const { ready, trained } = useTrained();
  const [stock, setStock] = useState(String(MAX));
  const [date, setDate] = useState("2026-12-04");
  const [saved, setSaved] = useState(false);
  if (!ready) return <div className="h-[600px]" />;

  const over = Number(stock) > MAX;
  return (
    <div>
      <h1 className="text-2xl font-bold">Pasokan saya</h1>
      <p className="mt-1 text-sm text-tanah-600">Cukup isi stok dan jadwal panen. Sistem yang mencarikan pembelinya.</p>
      {!trained ? (
        <Locked title="Pasokan terkunci" text="Selesaikan pelatihan dan kuis akhir dulu supaya hasil panen Anda bisa masuk katalog." />
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); if (!over) setSaved(true); }} className="mt-4 space-y-4">
          <section className="surface p-4">
            <p className="text-sm font-semibold">Cabai merah keriting</p>
            <dl className="num mt-2 space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-tanah-500">Estimasi panen</dt><dd>{formatKg(ESTIMATE)}</dd></div>
              <div className="flex justify-between"><dt className="text-tanah-500">Batas lewat aplikasi ({RULES.maxPortionPct}%)</dt><dd>{formatKg(MAX)}</dd></div>
            </dl>
          </section>
          <Field label="Stok yang dijual lewat aplikasi (kg)" hint="Sisanya tetap boleh dijual ke langganan lama.">
            <Input type="number" min={1} required value={stock} onChange={(e) => { setStock(e.target.value); setSaved(false); }} />
          </Field>
          {over && <p role="alert" className="rounded-lg border border-kunyit-200 bg-kunyit-50 p-3 text-sm text-kunyit-700">Melebihi batas {formatKg(MAX)}. Kurangi stok agar panen Anda tetap punya cadangan untuk langganan lama.</p>}
          <Field label="Perkiraan tanggal panen"><Input type="date" required value={date} onChange={(e) => { setDate(e.target.value); setSaved(false); }} /></Field>
          <Field label="Titik kumpul"><Select defaultValue="Titik kumpul Samarang"><option>Titik kumpul Samarang</option><option>Titik kumpul Cikajang</option></Select></Field>
          <Button type="submit" variant="accent" size="lg" className="w-full" disabled={over}>Simpan pasokan</Button>
          {saved && (
            <div role="status" className="flex items-center justify-between gap-3 rounded-lg bg-daun-50 p-3 text-sm text-daun-900">
              <span className="flex items-center gap-2"><Check className="h-4 w-4" strokeWidth={3} />Pasokan tersimpan. Tunggu notifikasi pesanan.</span>
              <StatusBadge status="terverifikasi" />
            </div>
          )}
        </form>
      )}
    </div>
  );
}
