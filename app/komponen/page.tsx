import { AppShell } from "@/components/AppShell";
import { MobileFrame } from "@/components/MobileFrame";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { StatusBadge, STATUS } from "@/components/StatusBadge";
import { StepTimeline } from "@/components/StepTimeline";
import { Button } from "@/components/ui/button";
import { SERVICE_FEE_PCT, farmerBoard, order, orderSteps, type StatusKey } from "@/data/dummy";
import { formatKg, formatTanggal } from "@/lib/utils";

const swatches = [
  { name: "daun-600", cls: "bg-daun-600" }, { name: "daun-100", cls: "bg-daun-100" }, { name: "tanah-900", cls: "bg-tanah-900" },
  { name: "tanah-200", cls: "bg-tanah-200" }, { name: "kunyit-400", cls: "bg-kunyit-400" }, { name: "cabai-500", cls: "bg-cabai-500" },
  { name: "langit-600", cls: "bg-langit-600" }, { name: "kabut", cls: "bg-kabut border border-line" },
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function KomponenPage() {
  return (
    <AppShell role="buyer" title="Komponen dasar" description="Halaman uji untuk memastikan semua komponen Tahap 1 tampil rapi. Hapus atau biarkan, tidak masuk alur demo.">
      <Block title="Warna">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {swatches.map((s) => (
            <div key={s.name}><div className={`h-16 rounded-lg ${s.cls}`} /><p className="mt-1.5 text-xs text-tanah-600">{s.name}</p></div>
          ))}
        </div>
      </Block>

      <Block title="Tombol">
        <div className="flex flex-wrap gap-3">
          <Button>Kirim permintaan</Button><Button variant="accent">Terima penawaran</Button>
          <Button variant="outline">Simpan draf</Button><Button variant="ghost">Batal</Button><Button variant="danger">Tolak</Button>
        </div>
      </Block>

      <Block title="Badge status">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(STATUS) as StatusKey[]).map((k) => <StatusBadge key={k} status={k} />)}
        </div>
      </Block>

      <Block title="Timeline pesanan">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="surface p-6"><StepTimeline steps={orderSteps} current={order.currentStep} /></div>
          <div className="surface p-6"><StepTimeline steps={orderSteps} current={order.currentStep} orientation="vertical" /></div>
        </div>
      </Block>

      <div className="grid items-start gap-10 xl:grid-cols-2">
        <Block title="Rincian transaksi">
          <PriceBreakdown volumeKg={order.volumeKg} pricePerKg={order.pricePerKg} serviceFeePct={SERVICE_FEE_PCT} qcFee={order.qcFee} logisticsFee={order.logisticsFee} />
        </Block>
        <Block title="Bingkai HP (portal tani)">
          <MobileFrame>
            <div className="space-y-3 px-4 pt-2">
              <h3 className="text-xl font-bold">Permintaan untuk Anda</h3>
              {farmerBoard.map((r) => (
                <div key={r.id} className="surface p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold">{r.commodity}</p>
                    <span className="num rounded-md bg-daun-50 px-2 py-1 text-xs font-semibold text-daun-800">Cocok {r.matchPct}%</span>
                  </div>
                  <p className="num mt-1 text-sm text-tanah-600">{formatKg(r.volumeKg)} · kirim {formatTanggal(r.deliveryDate)}</p>
                  <p className="mt-0.5 text-sm text-tanah-500">{r.buyer}, {r.city}</p>
                </div>
              ))}
            </div>
          </MobileFrame>
        </Block>
      </div>
    </AppShell>
  );
}
