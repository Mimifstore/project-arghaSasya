"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { formatKg, formatRupiah, formatTanggal } from "@/lib/utils";

type Param = { name: string; standard: string };

const COMMODITIES: Record<string, { varieties: string[]; params: Param[] }> = {
  Kentang: {
    varieties: ["Granola", "Atlantik"],
    params: [
      { name: "Diameter umbi", standard: "5–7 cm" },
      { name: "Tingkat kerusakan", standard: "maks. 5%" },
      { name: "Kebersihan (tanah menempel)", standard: "maks. 3%" },
      { name: "Kemasan", standard: "Karung jaring 25 kg" },
    ],
  },
  "Cabai merah keriting": {
    varieties: ["Keriting merah"],
    params: [
      { name: "Panjang buah", standard: "10–14 cm" },
      { name: "Tingkat kematangan", standard: "merah min. 90%" },
      { name: "Tingkat kerusakan", standard: "maks. 5%" },
      { name: "Kemasan", standard: "Karung jaring 10 kg" },
    ],
  },
  "Bawang merah": {
    varieties: ["Bima Brebes", "Tajuk"],
    params: [
      { name: "Diameter umbi", standard: "min. 3 cm" },
      { name: "Kondisi umbi", standard: "kering angin, tidak bertunas" },
      { name: "Tingkat kerusakan", standard: "maks. 5%" },
      { name: "Kemasan", standard: "Karung jaring 25 kg" },
    ],
  },
};

const PAYMENTS = ["Transfer 3 hari setelah barang diterima", "Transfer saat barang diterima", "Uang muka 30%, sisanya saat barang diterima"];

function Section({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-8 first:border-t-0 first:pt-0 last:pb-0">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-tanah-500">{text}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Unit({ children, suffix }: { children: React.ReactNode; suffix: string }) {
  return (
    <div className="relative">
      {children}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-tanah-500">{suffix}</span>
    </div>
  );
}

export function RequestForm() {
  const router = useRouter();
  const [commodity, setCommodity] = useState("Kentang");
  const [variety, setVariety] = useState("Granola");
  const [volume, setVolume] = useState("2000");
  const [date, setDate] = useState("2026-12-15");
  const [location, setLocation] = useState("Dapur pusat CV Dapur Nusantara, Kiaracondong, Bandung");
  const [validUntil, setValidUntil] = useState("2026-11-25");
  const [payment, setPayment] = useState(PAYMENTS[0]);
  const [refPrice, setRefPrice] = useState("");
  const [terms, setTerms] = useState("Barang yang tidak lolos pemeriksaan disortir ulang atau diganti sesuai kesepakatan.");
  const [params, setParams] = useState<Param[]>(COMMODITIES.Kentang.params);

  const onCommodity = (c: string) => {
    setCommodity(c);
    setVariety(COMMODITIES[c].varieties[0]);
    setParams(COMMODITIES[c].params);
  };
  const setParam = (i: number, key: keyof Param, v: string) => setParams((p) => p.map((x, j) => (j === i ? { ...x, [key]: v } : x)));

  const vol = Number(volume) || 0;
  const price = Number(refPrice) || 0;
  const rows: [string, string][] = [
    ["Komoditas", `${commodity} ${variety}`],
    ["Volume", vol ? formatKg(vol) : "-"],
    ["Kirim pada", date ? formatTanggal(date) : "-"],
    ["Parameter kualitas", `${params.filter((p) => p.name).length} parameter`],
    ["Estimasi nilai", vol && price ? formatRupiah(vol * price) : "Ditentukan dari penawaran"],
  ];

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
      <form id="request-form" onSubmit={(e) => { e.preventDefault(); router.push("/buyer/requests/1"); }} className="surface p-6 lg:p-8">
        <Section title="Komoditas dan volume" text="Apa yang Anda butuhkan dan berapa banyak.">
          <Field label="Komoditas">
            <Select value={commodity} onChange={(e) => onCommodity(e.target.value)}>
              {Object.keys(COMMODITIES).map((c) => <option key={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Varietas">
            <Select value={variety} onChange={(e) => setVariety(e.target.value)}>
              {COMMODITIES[commodity].varieties.map((v) => <option key={v}>{v}</option>)}
            </Select>
          </Field>
          <Field label="Volume yang dibutuhkan">
            <Unit suffix="kg"><Input type="number" min={1} required value={volume} onChange={(e) => setVolume(e.target.value)} className="pr-10" /></Unit>
          </Field>
        </Section>

        <Section title="Pengiriman" text="Kapan dan ke mana barang dikirim.">
          <Field label="Tanggal kirim"><Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <Field label="Permintaan berlaku sampai"><Input type="date" required value={validUntil} onChange={(e) => setValidUntil(e.target.value)} /></Field>
          <Field label="Lokasi pengiriman" className="sm:col-span-2"><Input required value={location} onChange={(e) => setLocation(e.target.value)} /></Field>
        </Section>

        <Section title="Standar kualitas" text="Parameter yang akan diperiksa petugas sebelum barang dikirim.">
          <div className="space-y-3 sm:col-span-2">
            {params.map((p, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <Input aria-label="Parameter" placeholder="Parameter" value={p.name} onChange={(e) => setParam(i, "name", e.target.value)} />
                <Input aria-label="Standar" placeholder="Standar" value={p.standard} onChange={(e) => setParam(i, "standard", e.target.value)} />
                <Button type="button" variant="ghost" size="md" onClick={() => setParams((x) => x.filter((_, j) => j !== i))}>Hapus</Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setParams((x) => [...x, { name: "", standard: "" }])}>Tambah parameter</Button>
          </div>
        </Section>

        <Section title="Harga dan pembayaran" text="Harga acuan boleh dikosongkan, kelompok tani akan mengajukan harga.">
          <Field label="Harga acuan (opsional)">
            <Unit suffix="Rp/kg"><Input type="number" min={0} placeholder="11500" value={refPrice} onChange={(e) => setRefPrice(e.target.value)} className="pr-16" /></Unit>
          </Field>
          <Field label="Ketentuan pembayaran" className="sm:col-span-2">
            <Select value={payment} onChange={(e) => setPayment(e.target.value)}>{PAYMENTS.map((p) => <option key={p}>{p}</option>)}</Select>
          </Field>
          <Field label="Ketentuan penolakan barang" className="sm:col-span-2"><Textarea value={terms} onChange={(e) => setTerms(e.target.value)} /></Field>
        </Section>
      </form>

      <aside className="surface-raised p-6 lg:sticky lg:top-8">
        <h2 className="text-lg font-semibold">Ringkasan permintaan</h2>
        <dl className="mt-4 divide-y divide-line text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-3">
              <dt className="text-tanah-500">{k}</dt>
              <dd className="num text-right font-medium text-tanah-900">{v}</dd>
            </div>
          ))}
        </dl>
        <Button type="submit" form="request-form" variant="accent" size="lg" className="mt-5 w-full">Kirim permintaan</Button>
        <p className="mt-3 text-xs text-tanah-500">Setelah dikirim, kelompok tani yang cocok dapat mengajukan penawaran. Akun Anda sudah terverifikasi.</p>
      </aside>
    </div>
  );
}
