import { AppShell } from "@/components/AppShell";
import { AccountQueue } from "@/components/admin/AccountQueue";
import { DisputeQueue } from "@/components/admin/DisputeQueue";
import { PilotIndicators } from "@/components/admin/PilotIndicators";
import { VolumeChart } from "@/components/admin/VolumeChart";
import { Badge } from "@/components/ui/badge";
import { GRADES, RULES } from "@/data/agri";
import { formatRupiah } from "@/lib/utils";

const running: { id: string; item: string; who: string; stage: string; tone: "info" | "warning" | "danger" }[] = [
  { id: "PKG-2612-0042", item: "1.000 kg Grade A", who: "CV Dapur Nusantara, 5 petani", stage: "Diterima, verifikasi", tone: "info" },
  { id: "PKG-2612-0039", item: "500 kg Grade B", who: "Katering Rasa Priangan, 3 petani", stage: "Dijemput", tone: "info" },
  { id: "PKG-2612-0036", item: "750 kg Grade A", who: "Distributor Segar Jabar, 4 petani", stage: "Petani diberi tahu", tone: "warning" },
  { id: "PKG-2612-0031", item: "800 kg Grade A", who: "Katering Rasa Priangan, 4 petani", stage: "Dalam peninjauan", tone: "danger" },
];

const rules: [string, string][] = [
  ["Harga acuan Grade A", formatRupiah(GRADES.A.price) + "/kg"], ["Harga acuan Grade B", formatRupiah(GRADES.B.price) + "/kg"], ["Harga acuan Grade C", formatRupiah(GRADES.C.price) + "/kg"],
  ["Komisi petani", `${RULES.feeFarmerPct}%`], ["Biaya layanan pembeli", `${RULES.feeBuyerPct}%`], ["Margin logistik", formatRupiah(RULES.logisticsMarginPerKg) + "/kg"],
  ["Nilai lulus pelatihan", `${RULES.passScore}`], ["Batas kuota per petani", `${RULES.maxPoolSharePct}% paket`], ["Batas panen lewat aplikasi", `${RULES.maxPortionPct}% estimasi panen`],
  ["Batas verifikasi penerimaan", `${RULES.receiveWindowHours} jam`], ["Cadangan penyesuaian harga", `${RULES.adjustmentReservePct}%`], ["Batas peninjauan admin", "5% selisih nilai"],
];

export default function AdminPage() {
  const stats = [
    { label: "Volume bulan ini", value: "3.800 kg", sub: "Syarat lanjut pilot: min. 3.000 kg" },
    { label: "Nilai transaksi", value: formatRupiah(133000000), sub: `Komisi platform ${formatRupiah(9310000)} (Rp2.450/kg)` },
    { label: "Petani terlatih", value: "42", sub: "dari 58 yang terdaftar" },
    { label: "Paket aktif", value: String(running.length), sub: "Rata-rata 4 petani per paket" },
  ];

  return (
    <AppShell role="admin" title="Ringkasan operasional pilot" description="Pantau pasokan, peninjauan mutu, dan akun petani dan pembeli. Seluruh angka pada halaman ini adalah simulasi dan proyeksi, bukan data transaksi nyata.">
      <section className="surface grid divide-y divide-line lg:grid-cols-4 lg:divide-x lg:divide-y-0">
        {stats.map((x) => (
          <div key={x.label} className="p-6">
            <p className="text-sm text-tanah-500">{x.label}</p>
            <p className="num mt-1 font-display text-3xl font-bold">{x.value}</p>
            <p className="mt-1 text-xs text-tanah-500">{x.sub}</p>
          </div>
        ))}
      </section>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section className="surface p-6">
          <h2 className="text-xl font-semibold">Proyeksi volume tahun pertama</h2>
          <p className="mb-4 mt-1 text-sm text-tanah-500">Kilogram per bulan, dari roadmap: pilot bulan 5 sampai 6, evaluasi bulan 7, target 9 ton di bulan 12 (total sekitar 38 ton).</p>
          <VolumeChart />
        </section>
        <section className="surface p-6">
          <h2 className="text-xl font-semibold">Paket berjalan</h2>
          <p className="mt-1 text-sm text-tanah-500">Menampilkan {running.length} paket aktif.</p>
          <ul className="mt-3 divide-y divide-line">
            {running.map((r) => (
              <li key={r.id} className="py-3.5">
                <div className="flex items-start justify-between gap-3"><p className="num text-sm font-semibold">{r.id}</p><Badge tone={r.tone} className="shrink-0">{r.stage}</Badge></div>
                <p className="mt-1 text-sm">Cabai merah keriting, {r.item}</p>
                <p className="mt-0.5 text-xs text-tanah-500">{r.who}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-8 space-y-8">
        <DisputeQueue />
        <AccountQueue />
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <section className="surface p-6">
            <h2 className="text-xl font-semibold">Indikator syarat lanjut pilot</h2>
            <p className="mt-1 text-sm text-tanah-500">Dievaluasi di bulan 7. Garis hitam menandai syarat. Nilai simulasi.</p>
            <PilotIndicators />
          </section>
          <section className="surface p-6">
            <h2 className="text-xl font-semibold">Aturan yang berlaku</h2>
            <p className="mt-1 text-sm text-tanah-500">Dikelola administrator. Perubahan berlaku untuk pesanan baru.</p>
            <dl className="mt-3 divide-y divide-line text-sm">
              {rules.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-tanah-500">{k}</dt><dd className="num text-right font-medium">{v}</dd></div>)}
            </dl>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
