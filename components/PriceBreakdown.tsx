import { cn, formatKg, formatRupiah } from "@/lib/utils";

type Props = { volumeKg: number; pricePerKg: number; serviceFeePct: number; qcFee: number; logisticsFee: number; className?: string };

export function PriceBreakdown({ volumeKg, pricePerKg, serviceFeePct, qcFee, logisticsFee, className }: Props) {
  const gross = volumeKg * pricePerKg;
  const serviceFee = Math.round((gross * serviceFeePct) / 100);
  const net = gross - serviceFee - qcFee;
  const buyerTotal = gross + logisticsFee;
  const share = (v: number) => `${(v / gross) * 100}%`;

  const rows = [
    { label: "Nilai dasar transaksi", note: `${formatKg(volumeKg)} × ${formatRupiah(pricePerKg)}`, value: formatRupiah(gross) },
    { label: `Biaya layanan Argha Sasya (${serviceFeePct}%)`, value: "− " + formatRupiah(serviceFee) },
    { label: "Biaya pemeriksaan kualitas", value: "− " + formatRupiah(qcFee) },
  ];
  const legend = [
    { label: "Hasil bersih petani", dot: "bg-daun-600" },
    { label: "Biaya layanan", dot: "bg-kunyit-400" },
    { label: "Pemeriksaan kualitas", dot: "bg-tanah-300" },
  ];

  return (
    <section className={cn("surface-raised overflow-hidden", className)}>
      <div className="p-6">
        <h3 className="text-base font-semibold text-tanah-700">Diterima kelompok tani</h3>
        <p className="num mt-1 font-display text-4xl font-bold text-daun-700">{formatRupiah(net)}</p>

        <div role="img" aria-label="Pembagian nilai transaksi" className="mt-5 flex h-3 gap-0.5 overflow-hidden rounded-full">
          <span className="bg-daun-600" style={{ width: share(net) }} />
          <span className="bg-kunyit-400" style={{ width: share(serviceFee) }} />
          <span className="bg-tanah-300" style={{ width: share(qcFee) }} />
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-tanah-600">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-1.5"><span className={cn("h-2 w-2 rounded-sm", l.dot)} />{l.label}</li>
          ))}
        </ul>

        <dl className="mt-6 divide-y divide-line text-sm">
          {rows.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between gap-4 py-3">
              <dt>
                <span className="text-tanah-800">{r.label}</span>
                {r.note && <span className="num mt-0.5 block text-xs text-tanah-500">{r.note}</span>}
              </dt>
              <dd className="num font-medium text-tanah-900">{r.value}</dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="font-semibold text-tanah-950">Hasil bersih kelompok tani</dt>
            <dd className="num font-semibold text-daun-700">{formatRupiah(net)}</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-2 border-t border-line bg-tanah-50 px-6 py-4 text-sm">
        <div className="flex justify-between gap-4 text-tanah-600">
          <span>Biaya logistik (ditanggung pembeli)</span><span className="num">{formatRupiah(logisticsFee)}</span>
        </div>
        <div className="flex justify-between gap-4 font-semibold text-tanah-950">
          <span>Total dibayar pembeli</span><span className="num">{formatRupiah(buyerTotal)}</span>
        </div>
      </div>
    </section>
  );
}
