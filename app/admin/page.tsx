import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { TransactionChart } from "@/components/admin/TransactionChart";
import { VerificationQueue } from "@/components/admin/VerificationQueue";
import { SERVICE_FEE_PCT, adminStats as s, type StatusKey } from "@/data/dummy";
import { formatRupiah } from "@/lib/utils";

const running: { id: string; item: string; who: string; status: StatusKey }[] = [
  { id: "ARG-ORD-2611-0007", item: "Kentang Granola, 2.000 kg", who: "CV Dapur Nusantara dari Tani Makmur", status: "diperiksa" },
  { id: "ARG-ORD-2611-0005", item: "Cabai merah keriting, 500 kg", who: "Katering Rasa Priangan dari Sumber Rejeki", status: "dikirim" },
  { id: "ARG-ORD-2611-0003", item: "Bawang merah, 1.000 kg", who: "Distributor Segar Jabar dari Mekar Tani", status: "dikumpulkan" },
];

export default function AdminPage() {
  const stats = [
    { label: "Transaksi bulan ini", value: formatRupiah(s.transaksiBulanIni), sub: `Komisi layanan ${SERVICE_FEE_PCT}%: ${formatRupiah(s.komisi)}` },
    { label: "Pesanan aktif", value: String(s.pesananAktif), sub: "Sedang dikumpulkan, diperiksa, atau dikirim" },
    { label: "Kelompok tani terverifikasi", value: String(s.kelompokTerverifikasi), sub: "Di Kabupaten Garut" },
    { label: "Pemenuhan pesanan", value: `${s.pemenuhanPct}%`, sub: "Volume terkirim sesuai kesepakatan" },
  ];

  return (
    <AppShell role="admin" title="Ringkasan operasional" description="Pantau transaksi, pesanan berjalan, dan akun yang menunggu verifikasi. Seluruh angka pada halaman ini adalah simulasi.">
      <section className="surface grid divide-y divide-line lg:grid-cols-4 lg:divide-x lg:divide-y-0">
        {stats.map((x) => (
          <div key={x.label} className="p-6">
            <p className="text-sm text-tanah-500">{x.label}</p>
            <p className="num mt-1 font-display text-3xl font-bold">{x.value}</p>
            <p className="mt-1 text-xs text-tanah-500">{x.sub}</p>
          </div>
        ))}
      </section>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
        <section className="surface p-6">
          <h2 className="text-xl font-semibold">Nilai transaksi per bulan</h2>
          <p className="mb-4 mt-1 text-sm text-tanah-500">Dalam juta rupiah. Data simulasi.</p>
          <TransactionChart />
        </section>
        <section className="surface p-6">
          <h2 className="text-xl font-semibold">Pesanan berjalan</h2>
          <p className="mt-1 text-sm text-tanah-500">Menampilkan {running.length} dari {s.pesananAktif} pesanan aktif.</p>
          <ul className="mt-4 divide-y divide-line">
            {running.map((r) => (
              <li key={r.id} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="num text-sm font-semibold">{r.id}</p>
                  <StatusBadge status={r.status} className="shrink-0" />
                </div>
                <p className="mt-1 text-sm">{r.item}</p>
                <p className="mt-0.5 text-xs text-tanah-500">{r.who}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-8"><VerificationQueue /></div>
    </AppShell>
  );
}
