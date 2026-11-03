import { AppShell } from "@/components/AppShell";
import { OrderFlow } from "@/components/OrderFlow";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { SERVICE_FEE_PCT, buyer, buyerRequest as req, getGroup, offers, order } from "@/data/dummy";
import { formatKg, formatRupiah, formatTanggal } from "@/lib/utils";

const TERMS = "Barang yang tidak lolos pemeriksaan disortir ulang atau diganti sesuai kesepakatan. Tidak ada pemotongan pembayaran otomatis.";

export default function OrderPage({ searchParams }: { searchParams: { penawaran?: string } }) {
  const offer = offers.find((o) => o.id === searchParams.penawaran) ?? offers[0];
  const group = getGroup(offer.groupId);
  const short = req.volumeKg - offer.volumeKg;
  const rows: [string, string][] = [
    ["Nomor pesanan", order.id],
    ["Pembeli", buyer.name],
    ["Kelompok tani", `${group.name}, ${group.village}`],
    ["Komoditas", `${req.commodity} ${req.variety}`],
    ["Volume", formatKg(offer.volumeKg)],
    ["Harga per kg", formatRupiah(offer.pricePerKg)],
    ["Jadwal kirim", formatTanggal(req.deliveryDate)],
    ["Lokasi pengiriman", req.deliveryLocation],
    ["Pembayaran", req.payment],
  ];

  return (
    <AppShell role="buyer" title="Ringkasan kesepakatan" description="Periksa ringkasan ini. Setiap perubahan harga, volume, jadwal, atau standar kualitas perlu persetujuan pihak yang terdampak.">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="surface p-6 lg:p-8">
            <h2 className="text-xl font-semibold">Isi kesepakatan</h2>
            <dl className="mt-4 divide-y divide-line text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-3"><dt className="shrink-0 text-tanah-500">{k}</dt><dd className="num text-right font-medium">{v}</dd></div>
              ))}
            </dl>
            <h3 className="mt-6 text-sm font-semibold">Standar kualitas</h3>
            <ul className="mt-2 divide-y divide-line border-y border-line text-sm">
              {req.quality.map((q) => (
                <li key={q.name} className="flex justify-between gap-6 py-2.5"><span className="text-tanah-600">{q.name}</span><span className="font-medium">{q.standard}</span></li>
              ))}
            </ul>
            <h3 className="mt-6 text-sm font-semibold">Ketentuan penolakan barang</h3>
            <p className="mt-1.5 text-sm text-tanah-600">{TERMS}</p>
            {short > 0 && (
              <p className="mt-5 rounded-lg border border-kunyit-200 bg-kunyit-50 p-3 text-sm text-kunyit-700">
                Penawaran ini {formatKg(short)} di bawah kebutuhan. Permintaan berstatus terpenuhi sebagian, dan sisa volume tetap terbuka untuk penawaran lain.
              </p>
            )}
          </section>
          <OrderFlow buyerName={buyer.name} groupName={group.name} />
        </div>
        <div className="lg:sticky lg:top-8">
          <PriceBreakdown volumeKg={offer.volumeKg} pricePerKg={offer.pricePerKg} serviceFeePct={SERVICE_FEE_PCT} qcFee={order.qcFee} logisticsFee={order.logisticsFee} />
          <p className="mt-3 text-sm text-tanah-500">Rincian ini sama dengan yang dilihat kelompok tani.</p>
        </div>
      </div>
    </AppShell>
  );
}
