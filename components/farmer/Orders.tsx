"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Check, Truck } from "lucide-react";
import { Locked } from "@/components/farmer/Locked";
import { useTrained } from "@/components/farmer/useTrained";
import { GradeBadge } from "@/components/GradeBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DEMO_PACKAGE, GRADES, RULES } from "@/data/agri";
import { cn, formatKg, formatRupiah, formatTanggal } from "@/lib/utils";

const KG = 200;

export function Orders() {
  const { ready, trained } = useTrained();
  const [accepted, setAccepted] = useState(false);
  if (!ready) return <div className="h-[600px]" />;

  const gross = KG * GRADES.A.price;
  const fee = Math.round((gross * RULES.feeFarmerPct) / 100);
  return (
    <div>
      <h1 className="text-2xl font-bold">Pesanan masuk</h1>
      {!trained ? (
        <Locked title="Pesanan terkunci" text="Pesanan hanya dikirim ke petani yang sudah lulus pelatihan dan kuis akhir." />
      ) : (
        <>
          <p className="mt-1 text-sm text-tanah-600">Tidak perlu mencari pembeli. Pesanan datang ke Anda.</p>
          <section className="mt-4 rounded-xl border border-daun-200 bg-daun-50 p-4">
            <div className="flex items-center justify-between text-xs text-tanah-500"><span className="font-semibold text-daun-800">WhatsApp, Argha Sasya</span><span className="num">07.12</span></div>
            <p className="mt-2 text-sm text-tanah-900">Panen kamu dipesan <b>200 kg</b> cabai merah keriting <b>Grade A</b> untuk dikirim {formatTanggal(DEMO_PACKAGE.deliveryDate)}. Sortir sesuai modul, lalu foto hasilnya di aplikasi. Barang dijemput {formatTanggal(DEMO_PACKAGE.pickupDate)}.</p>
          </section>

          <section className="surface mt-4 p-4">
            <div className="flex items-center justify-between"><p className="font-semibold">Cabai merah keriting</p><GradeBadge grade="A" /></div>
            <p className="mt-0.5 text-sm text-tanah-500">Pembeli terverifikasi, katering di Bandung</p>
            <dl className="num mt-3 divide-y divide-line text-sm">
              {([["Volume", formatKg(KG)], ["Harga per kg", formatRupiah(GRADES.A.price)], ["Nilai pesanan", formatRupiah(gross)], [`Komisi ${RULES.feeFarmerPct}%`, "− " + formatRupiah(fee)]] as const).map(([k, v]) => (
                <div key={k} className="flex justify-between py-2"><dt className="text-tanah-500">{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
              <div className="flex justify-between py-2.5"><dt className="font-semibold">Perkiraan diterima</dt><dd className="font-bold text-daun-700">{formatRupiah(gross - fee)}</dd></div>
            </dl>
            <p className="mt-1 text-xs text-tanah-500">Dana ditahan di escrow dan cair 1 sampai 2 hari setelah barang diterima. Harga menyesuaikan grade aktual saat penerimaan.</p>
          </section>

          {!accepted ? (
            <div className="mt-4 grid gap-2">
              <Button variant="accent" size="lg" onClick={() => setAccepted(true)}>Terima pesanan</Button>
              <Button variant="outline" size="lg">Tidak bisa memenuhi</Button>
              <p className="text-center text-xs text-tanah-500">Konfirmasi paling lambat 2 jam setelah notifikasi.</p>
            </div>
          ) : (
            <section className="mt-4">
              <h2 className="text-lg font-semibold">Yang perlu dikerjakan</h2>
              <ol className="surface mt-3 divide-y divide-line text-sm">
                {[["Sortir cabai sesuai modul", "Pisahkan buah rusak dan belum matang"], ["Foto hasil panen dan isi checklist", "Dinilai AI, hasilnya jadi grade dan badge"], [`Barang dijemput ${formatTanggal(DEMO_PACKAGE.pickupDate)}, 07.00`, "Titik kumpul Samarang, mitra logistik lokal"], ["Dana cair 1 sampai 2 hari", "Setelah pembeli mengonfirmasi penerimaan"]].map(([t, d], i) => (
                  <li key={t} className="flex gap-3 px-4 py-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-daun-100 text-xs font-bold text-daun-800">{i === 0 ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}</span>
                    <div><p className="font-medium">{t}</p><p className="text-xs text-tanah-500">{d}</p></div>
                  </li>
                ))}
              </ol>
              <Link href="/farmer/pesanan/foto" className={cn(buttonVariants({ variant: "accent", size: "lg" }), "mt-4 w-full")}><Camera className="h-5 w-5" />Foto dan nilai hasil panen</Link>
              <p className="mt-3 flex items-center gap-2 text-xs text-tanah-500"><Truck className="h-4 w-4" />Penjemputan diatur sistem, Anda tidak perlu mengantar.</p>
            </section>
          )}
        </>
      )}
    </div>
  );
}
