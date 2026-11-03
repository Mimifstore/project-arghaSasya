"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { verificationQueue, type StatusKey } from "@/data/dummy";
import { formatTanggal } from "@/lib/utils";

const REASONS = ["Dokumen tidak lengkap", "Data tidak sesuai dokumen", "Lokasi tidak dapat diverifikasi"];
const stamp = () => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date());

export function VerificationQueue() {
  const [items, setItems] = useState(verificationQueue.map((v) => ({ ...v })));
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState(REASONS[0]);
  const [log, setLog] = useState<{ text: string; time: string }[]>([]);
  const open = (s: StatusKey) => s !== "terverifikasi" && s !== "ditolak";
  const pending = items.filter((i) => open(i.status)).length;

  const decide = (id: string, status: StatusKey, why?: string) => {
    const it = items.find((i) => i.id === id)!;
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, status } : x)));
    setLog((l) => [{ text: `${it.name}: ${status === "terverifikasi" ? "disetujui" : `ditolak (${why})`} oleh Tim operasional`, time: stamp() }, ...l]);
    setRejecting(null);
  };

  return (
    <section className="surface">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line p-6">
        <h2 className="text-xl font-semibold">Antrian verifikasi akun</h2>
        <p className="text-sm text-tanah-500">{pending} menunggu keputusan</p>
      </div>
      <ul className="divide-y divide-line px-6">
        {items.map((it) => (
          <li key={it.id} className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold">{it.name}</p>
                <p className="text-sm text-tanah-500">{it.role} · {it.place} · diajukan {formatTanggal(it.submitted)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={it.status} />
                {open(it.status) && (
                  <>
                    <Button size="sm" onClick={() => decide(it.id, "terverifikasi")}>Setujui</Button>
                    <Button size="sm" variant="outline" onClick={() => { setRejecting(it.id); setReason(REASONS[0]); }}>Tolak</Button>
                  </>
                )}
              </div>
            </div>
            {rejecting === it.id && (
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-tanah-50 p-3">
                <Select aria-label="Alasan penolakan" className="w-auto min-w-[16rem]" value={reason} onChange={(e) => setReason(e.target.value)}>
                  {REASONS.map((r) => <option key={r}>{r}</option>)}
                </Select>
                <Button size="sm" variant="danger" onClick={() => decide(it.id, "ditolak", reason)}>Konfirmasi tolak</Button>
                <Button size="sm" variant="ghost" onClick={() => setRejecting(null)}>Batal</Button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="border-t border-line bg-tanah-50 p-6 text-sm">
        <h3 className="font-semibold">Riwayat perubahan status</h3>
        {log.length === 0 ? (
          <p className="mt-1 text-tanah-500">Belum ada perubahan. Setiap keputusan dicatat dengan waktu, pelaksana, dan alasan penolakan.</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {log.map((l, i) => <li key={i} className="flex flex-wrap justify-between gap-2"><span>{l.text}</span><span className="num text-tanah-500">{l.time}</span></li>)}
          </ul>
        )}
      </div>
    </section>
  );
}
