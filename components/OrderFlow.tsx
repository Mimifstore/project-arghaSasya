"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { StepTimeline } from "@/components/StepTimeline";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { order, orderSteps, type StatusKey } from "@/data/dummy";
import { cn } from "@/lib/utils";

const DATES = ["2026-11-12", "2026-12-09", "2026-12-10", "2026-12-13", "2026-12-15", "2026-12-18"];

function Approval({ name, role, ok, onApprove, action, note }: { name: string; role: string; ok: boolean; onApprove: () => void; action: string; note?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-tanah-500">{role}</p>
        {note && !ok && <p className="mt-1 text-xs text-tanah-500">{note}</p>}
      </div>
      {ok ? (
        <Badge tone="success"><Check className="h-3.5 w-3.5" strokeWidth={3} />Disetujui</Badge>
      ) : (
        <Button size="sm" variant={role === "Pembeli" ? "primary" : "outline"} onClick={onApprove}>{action}</Button>
      )}
    </div>
  );
}

export function OrderFlow({ buyerName, groupName }: { buyerName: string; groupName: string }) {
  const [buyerOk, setBuyerOk] = useState(false);
  const [farmerOk, setFarmerOk] = useState(false);
  const [step, setStep] = useState(0);
  const created = buyerOk && farmerOk;
  const steps = orderSteps.map((s, i) => ({ key: s.key, label: s.label, date: created && i <= step ? DATES[i] : undefined }));

  return (
    <>
      <section className="surface p-6 lg:p-8">
        <h2 className="text-xl font-semibold">Persetujuan</h2>
        <p className="mt-1 text-sm text-tanah-500">Pesanan dibuat setelah kedua pihak menyetujui ringkasan di atas.</p>
        <div className="mt-4 divide-y divide-line border-y border-line">
          <Approval name={buyerName} role="Pembeli" ok={buyerOk} onApprove={() => setBuyerOk(true)} action="Setujui sebagai pembeli" />
          <Approval name={groupName} role="Kelompok tani" ok={farmerOk} onApprove={() => setFarmerOk(true)} action="Setujui sebagai kelompok tani" note="Pada aplikasi nyata, kelompok tani menyetujui dari akunnya sendiri. Di demo, Anda mewakilinya." />
        </div>
        {created && (
          <div className="mt-5 rounded-lg bg-daun-50 p-4 text-sm text-daun-900">
            Pesanan <span className="num font-semibold">{order.id}</span> dibuat dan masuk ke riwayat persetujuan kedua pihak.
          </div>
        )}
      </section>

      <section className="surface p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Status pesanan</h2>
          {created ? <StatusBadge status={orderSteps[step].key as StatusKey} /> : <Badge tone="warning">Menunggu persetujuan</Badge>}
        </div>
        <StepTimeline steps={steps} current={created ? step : -1} className="mt-8 hidden md:flex" />
        <StepTimeline steps={steps} current={created ? step : -1} orientation="vertical" className="mt-6 md:hidden" />
        {created && (
          <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
            <Button variant="outline" size="sm" disabled={step >= orderSteps.length - 1} onClick={() => setStep((s) => Math.min(s + 1, orderSteps.length - 1))}>Majukan status (simulasi)</Button>
            <Link href="/inspector/qc/1" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>Buka form pemeriksaan petugas</Link>
          </div>
        )}
      </section>
    </>
  );
}
