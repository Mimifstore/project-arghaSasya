import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { GradeBadge } from "@/components/GradeBadge";
import { AllocationList } from "@/components/buyer/AllocationList";
import { RouteMap, SHARE_COLORS } from "@/components/buyer/RouteMap";
import { buttonVariants } from "@/components/ui/button";
import { DEMO_PACKAGE, RULES, allocate, quote, type Grade } from "@/data/agri";
import { cn, formatKg, formatRupiah, formatTanggal } from "@/lib/utils";

export default function AllocationPage({ searchParams }: { searchParams: { kg?: string; grade?: string; tgl?: string } }) {
  const kg = Math.min(5000, Math.max(100, Number(searchParams.kg) || DEMO_PACKAGE.kg));
  const grade: Grade = searchParams.grade === "B" ? "B" : "A";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(searchParams.tgl ?? "") ? searchParams.tgl! : DEMO_PACKAGE.deliveryDate;
  const plan = allocate(kg, date);
  const done = kg - plan.shortKg;
  const q = quote(done, grade, plan.allocs);
  const groups = new Set(plan.allocs.map((a) => a.farmer.group)).size;
  const next = `/orders/1?kg=${done}&grade=${grade}&tgl=${date}`;
  const stats: [string, string][] = [
    ["Petani terlibat", String(plan.allocs.length)],
    ["Kelompok tani", String(groups)],
    ["Jarak rata-rata", `${q.avgKm.toFixed(1).replace(".", ",")} km`],
    ["Diterima", formatTanggal(date)],
  ];
  const costs: [string, string][] = [
    [`Nilai pasokan Grade ${grade}`, formatRupiah(q.gross)],
    [`Biaya layanan ${RULES.feeBuyerPct}%`, formatRupiah(q.feeBuyer)],
    ["Angkut dari petani ke titik kumpul", formatRupiah(q.pickup)],
    ["Angkut ke Bandung", formatRupiah(q.lineHaul)],
    ["Biaya pengelolaan logistik", formatRupiah(q.margin)],
  ];

  return (
    <AppShell role="buyer" title="Alokasi pasokan otomatis" description="Sistem membagi paket Anda ke petani terlatih dengan skor mutu tertinggi dan lokasi terdekat. Anda tidak perlu memilih petani satu per satu.">
      <section className="surface flex flex-wrap items-center justify-between gap-6 p-6">
        <div>
          <div className="flex flex-wrap items-center gap-3"><h2 className="text-2xl font-bold">Cabai merah keriting, {formatKg(kg)}</h2><GradeBadge grade={grade} /></div>
          <p className="num mt-1 text-sm text-tanah-500">{DEMO_PACKAGE.id} · tujuan {DEMO_PACKAGE.buyer}, {DEMO_PACKAGE.city}</p>
        </div>
        <dl className="flex flex-wrap gap-x-10 gap-y-3">
          {stats.map(([k, v]) => <div key={k}><dt className="text-xs text-tanah-500">{k}</dt><dd className="num text-lg font-bold">{v}</dd></div>)}
        </dl>
      </section>
      {plan.shortKg > 0 && (
        <p role="alert" className="mt-4 rounded-lg border border-kunyit-200 bg-kunyit-50 p-3 text-sm text-kunyit-700">
          Pasokan petani terlatih yang tersedia baru {formatKg(done)} dari {formatKg(kg)}. Kekurangan {formatKg(plan.shortKg)} bisa dipesan terpisah setelah ada stok baru.
        </p>
      )}

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-8">
          <AllocationList allocs={plan.allocs} total={done} grade={grade} />
          <section className="surface p-6 text-sm">
            <h2 className="text-lg font-semibold">Cadangan dan yang tidak ikut</h2>
            <ul className="mt-3 divide-y divide-line">
              {plan.reserve.map((a) => <li key={a.farmer.id} className="flex justify-between gap-4 py-2.5"><span>{a.farmer.name}</span><span className="text-tanah-500">Cadangan, kuota sudah terpenuhi</span></li>)}
              {plan.excluded.map((e) => <li key={e.farmer.id} className="flex justify-between gap-4 py-2.5"><span>{e.farmer.name}</span><span className="text-cabai-600">{e.reason}</span></li>)}
            </ul>
          </section>
        </div>

        <div className="space-y-6 lg:sticky lg:top-8">
          <section className="surface p-4">
            <RouteMap allocs={plan.allocs} reserve={plan.reserve} excluded={plan.excluded} />
            <p className="mt-3 text-xs text-tanah-500">Peta skematik, tidak berskala. Titik besar berarti kuota besar. Pilihan mempertimbangkan jarak ke titik kumpul, bukan hanya mutu.</p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-tanah-600">
              {plan.allocs.map((a, i) => <li key={a.farmer.id} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: SHARE_COLORS[i % SHARE_COLORS.length] }} />{a.farmer.name.split(" ")[0]}</li>)}
            </ul>
          </section>
          <section className="surface-raised p-6">
            <h2 className="text-lg font-semibold">Rincian biaya</h2>
            <dl className="mt-3 divide-y divide-line text-sm">
              {costs.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-tanah-500">{k}</dt><dd className="num font-medium">{v}</dd></div>)}
              <div className="flex justify-between gap-4 py-3"><dt className="font-semibold">Total dibayar ke escrow</dt><dd className="num font-bold text-daun-700">{formatRupiah(q.buyerTotal)}</dd></div>
            </dl>
            <Link href={next} className={cn(buttonVariants({ variant: "accent", size: "lg" }), "mt-4 w-full")}>Konfirmasi dan bayar ke escrow</Link>
            <p className="mt-3 text-xs text-tanah-500">Dana ditahan di rekening penampung dan baru cair ke petani 1 sampai 2 hari setelah Anda mengonfirmasi penerimaan. Harga menyesuaikan grade aktual saat barang tiba.</p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
