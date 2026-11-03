import { AppShell } from "@/components/AppShell";
import { PackageForm } from "@/components/buyer/PackageForm";
import { PriceChart } from "@/components/buyer/PriceChart";

export default function NewPackagePage() {
  return (
    <AppShell role="buyer" title="Pesan paket pasokan" description="Tentukan grade, jumlah, dan tanggal. Sistem membagi pesanan ke petani terlatih terdekat, tanpa Anda memilih satu per satu.">
      <PackageForm />
      <section className="surface mt-8 p-6 lg:p-8">
        <h2 className="text-xl font-semibold">Harga acuan cabai merah keriting, 7 hari terakhir</h2>
        <p className="mb-4 mt-1 text-sm text-tanah-500">Per kilogram. Data ilustrasi, pada layanan nyata bersumber dari data resmi dan hasil pantauan tim.</p>
        <PriceChart />
      </section>
    </AppShell>
  );
}
