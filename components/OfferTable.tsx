import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getGroup } from "@/data/dummy";
import { formatKg, formatRupiah, formatTanggal } from "@/lib/utils";

type OfferRow = { id: string; groupId: string; volumeKg: number; pricePerKg: number; readyDate: string; pickup: string; distanceKm: number };

const score = (n: number) => n.toFixed(1).replace(".", ",");

export function OfferTable({ offers, requestedKg }: { offers: OfferRow[]; requestedKg: number }) {
  const minPrice = Math.min(...offers.map((o) => o.pricePerKg));
  const maxScore = Math.max(...offers.map((o) => getGroup(o.groupId).reliability));
  const rows = offers.map((o) => {
    const g = getGroup(o.groupId);
    return { o, g, total: o.volumeKg * o.pricePerKg, short: requestedKg - o.volumeKg, cheapest: o.pricePerKg === minPrice, best: g.reliability === maxScore };
  });
  const accept = (id: string) => `/orders/1?penawaran=${id}`;

  return (
    <>
      <div className="surface hidden overflow-x-auto md:block">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs font-semibold text-tanah-500">
              {["Kelompok tani", "Volume", "Harga per kg", "Nilai total", "Siap kirim", "Keandalan", ""].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map(({ o, g, total, short, cheapest, best }) => (
              <tr key={o.id} className="align-top">
                <td className="px-4 py-5">
                  <p className="font-semibold text-tanah-950">{g.name}</p>
                  <p className="mt-0.5 text-xs text-tanah-500">{g.village} · {g.members} anggota · {o.distanceKm} km</p>
                  <StatusBadge status={g.status} className="mt-2" />
                </td>
                <td className="num px-4 py-5">
                  <p className="font-medium">{formatKg(o.volumeKg)}</p>
                  <p className={short > 0 ? "mt-0.5 text-xs text-cabai-600" : "mt-0.5 text-xs text-daun-700"}>{short > 0 ? `Kurang ${formatKg(short)}` : "Volume penuh"}</p>
                </td>
                <td className="num px-4 py-5">
                  <p className="font-medium">{formatRupiah(o.pricePerKg)}</p>
                  {cheapest && <Badge tone="success" className="mt-1.5">Terendah</Badge>}
                </td>
                <td className="num px-4 py-5 font-medium">{formatRupiah(total)}</td>
                <td className="px-4 py-5">
                  <p className="num">{formatTanggal(o.readyDate)}</p>
                  <p className="mt-0.5 text-xs text-tanah-500">Ambil di {o.pickup}</p>
                </td>
                <td className="num px-4 py-5">
                  <p className="font-medium">{score(g.reliability)} dari 5</p>
                  <p className="mt-0.5 text-xs text-tanah-500">{g.fulfillmentPct}% terpenuhi · {g.completedOrders} pesanan</p>
                  {best && <Badge tone="success" className="mt-1.5">Tertinggi</Badge>}
                </td>
                <td className="px-4 py-5 text-right">
                  <Link href={accept(o.id)} className={buttonVariants({ variant: "primary", size: "sm" })}>Terima penawaran</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-4 md:hidden">
        {rows.map(({ o, g, total, short, cheapest, best }) => (
          <li key={o.id} className="surface p-5">
            <p className="font-semibold text-tanah-950">{g.name}</p>
            <p className="mt-0.5 text-xs text-tanah-500">{g.village} · {g.members} anggota · {o.distanceKm} km</p>
            <dl className="num mt-4 divide-y divide-line text-sm">
              {([
                ["Volume", `${formatKg(o.volumeKg)}${short > 0 ? ` (kurang ${formatKg(short)})` : ""}`],
                ["Harga per kg", `${formatRupiah(o.pricePerKg)}${cheapest ? " · terendah" : ""}`],
                ["Nilai total", formatRupiah(total)],
                ["Siap kirim", formatTanggal(o.readyDate)],
                ["Keandalan", `${score(g.reliability)} dari 5${best ? " · tertinggi" : ""}`],
              ] as const).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-tanah-500">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
              ))}
            </dl>
            <Link href={accept(o.id)} className={buttonVariants({ variant: "primary", size: "md" }) + " mt-4 w-full"}>Terima penawaran</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
