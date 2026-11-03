"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, Package, Sprout, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { farmerBoard, farmerSupply } from "@/data/dummy";
import { cn, formatKg, formatTanggal } from "@/lib/utils";

const FILTERS = ["Semua", "Kentang", "Cabai", "Bawang"];
const REASONS: Record<string, string> = {
  "REQ-2611-0042": "Komoditas, volume, dan jadwal panen sesuai",
  "REQ-2611-0045": "Lokasi dekat, komoditas belum tercatat",
  "REQ-2611-0047": "Komoditas belum tercatat, lokasi jauh",
};
const TABS = [
  { label: "Permintaan", icon: ClipboardList, active: true },
  { label: "Pesanan", icon: Package },
  { label: "Pasokan", icon: Sprout },
  { label: "Profil", icon: User },
];

export function FarmerBoard() {
  const [filter, setFilter] = useState("Semua");
  const list = farmerBoard.filter((r) => filter === "Semua" || r.commodity.toLowerCase().includes(filter.toLowerCase()));
  const available = farmerSupply.confirmedKg - farmerSupply.allocatedKg;

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 px-4 pt-2">
        <p className="text-sm text-tanah-500">Selamat pagi, Pak Dedi</p>
        <h1 className="text-2xl font-bold">Gapoktan Tani Makmur</h1>
        <p className="text-sm text-tanah-500">Cikajang, Garut</p>

        <section className="mt-4 rounded-xl bg-tanah-900 p-4 text-white">
          <p className="text-sm text-tanah-300">Pasokan terkonfirmasi, {farmerSupply.commodity}</p>
          <p className="num mt-1 font-display text-3xl font-bold">{formatKg(farmerSupply.confirmedKg)}</p>
          <p className="num mt-1 text-sm text-tanah-300">Dialokasikan {formatKg(farmerSupply.allocatedKg)} · tersedia {formatKg(available)}</p>
        </section>

        <h2 className="mt-6 text-lg font-semibold">Permintaan untuk Anda</h2>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f}
              className={cn("h-9 shrink-0 rounded-full px-4 text-sm font-medium transition-colors", filter === f ? "bg-daun-600 text-white" : "border border-tanah-200 bg-white text-tanah-700")}>
              {f}
            </button>
          ))}
        </div>

        <ul className="mt-4 space-y-3">
          {list.map((r, i) => (
            <li key={r.id} className="surface p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-tanah-950">{r.commodity}</p>
                <Badge tone={r.matchPct >= 85 ? "success" : r.matchPct >= 65 ? "warning" : "neutral"} className="num shrink-0">Cocok {r.matchPct}%</Badge>
              </div>
              <p className="num mt-1.5 text-sm text-tanah-700">{formatKg(r.volumeKg)} · kirim {formatTanggal(r.deliveryDate)}</p>
              <p className="mt-0.5 text-sm text-tanah-500">{r.buyer}, {r.city}</p>
              <p className="mt-2 text-xs text-tanah-500">{REASONS[r.id]}</p>
              <Link href={`/farmer/offers/new?permintaan=${r.id}`} className={cn(buttonVariants({ variant: i === 0 ? "primary" : "outline", size: "md" }), "mt-3 w-full")}>Ajukan penawaran</Link>
            </li>
          ))}
          {list.length === 0 && <li className="surface p-4 text-sm text-tanah-500">Belum ada permintaan untuk komoditas ini.</li>}
        </ul>
        <p className="mt-4 pb-4 text-xs text-tanah-500">Kecocokan adalah rekomendasi sistem, bukan jaminan Anda dapat memenuhi pesanan.</p>
      </div>

      <nav className="sticky bottom-0 grid grid-cols-4 border-t border-line bg-white px-2 pb-5 pt-2">
        {TABS.map(({ label, icon: Icon, active }) => (
          <span key={label} aria-current={active ? "page" : undefined} className={cn("flex flex-col items-center gap-1 py-1 text-xs font-medium", active ? "text-daun-700" : "text-tanah-400")}>
            <Icon className="h-5 w-5" />{label}
          </span>
        ))}
      </nav>
    </div>
  );
}
