import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { OfferTable } from "@/components/OfferTable";
import { StatusBadge } from "@/components/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { buyerRequest as req, offers } from "@/data/dummy";
import { formatKg, formatRupiah, formatTanggal } from "@/lib/utils";

export default function OffersPage() {
  const full = offers.filter((o) => o.volumeKg >= req.volumeKg).length;
  const prices = offers.map((o) => o.pricePerKg);
  const details: [string, string][] = [
    ["Volume", formatKg(req.volumeKg)],
    ["Kirim pada", formatTanggal(req.deliveryDate)],
    ["Lokasi", req.deliveryLocation],
    ["Berlaku sampai", formatTanggal(req.validUntil)],
    ["Pembayaran", req.payment],
  ];

  return (
    <AppShell
      role="buyer"
      title="Penawaran masuk"
      description={`${offers.length} kelompok tani menanggapi permintaan Anda. Bandingkan, lalu terima yang paling sesuai.`}
      actions={<Link href="/buyer/requests/new" className={buttonVariants({ variant: "outline", size: "sm" })}>Buat permintaan baru</Link>}
    >
      <section className="surface grid gap-8 p-6 lg:grid-cols-[1.4fr_1fr] lg:p-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold">{req.commodity} {req.variety}</h2>
            <StatusBadge status={req.status} />
          </div>
          <p className="num mt-1 text-sm text-tanah-500">{req.id}</p>
          <dl className="mt-5 divide-y divide-line text-sm">
            {details.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-2.5"><dt className="text-tanah-500">{k}</dt><dd className="num text-right font-medium">{v}</dd></div>
            ))}
          </dl>
          <p className="mt-5 text-sm font-semibold">Standar kualitas</p>
          <p className="mt-1.5 text-sm text-tanah-600">{req.quality.map((q) => `${q.name} ${q.standard}`).join(" · ")}</p>
        </div>
        <div className="rounded-xl bg-daun-50 p-6">
          <p className="num font-display text-5xl font-bold text-daun-700">{offers.length}</p>
          <p className="mt-1 font-semibold text-daun-900">penawaran masuk</p>
          <p className="mt-4 text-sm text-daun-900/80">{full} dari {offers.length} sanggup memenuhi volume penuh.</p>
          <p className="num mt-1 text-sm text-daun-900/80">Harga {formatRupiah(Math.min(...prices))} sampai {formatRupiah(Math.max(...prices))} per kg.</p>
        </div>
      </section>

      <h2 className="mb-4 mt-12 text-xl font-semibold">Bandingkan penawaran</h2>
      <OfferTable offers={offers} requestedKg={req.volumeKg} />
      <p className="mt-4 max-w-2xl text-sm text-tanah-500">
        Menerima penawaran akan membuat ringkasan kesepakatan. Pesanan baru dibuat setelah pembeli dan kelompok tani sama-sama menyetujuinya.
      </p>
    </AppShell>
  );
}
