import Link from "next/link";
import { MobileFrame } from "@/components/MobileFrame";

// Panggung untuk layar HP: bingkai di tengah, keterangan singkat di kiri (hanya di layar lebar).
export function FarmerStage({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen px-4 py-10 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-14">
      <div className="hidden max-w-xs justify-self-end lg:block">
        <p className="font-display text-3xl font-bold leading-tight text-tanah-950">Portal kelompok tani</p>
        <p className="mt-3 text-tanah-600">Dirancang untuk dipakai di HP: teks jelas, alur pendek, dan satu tujuan di setiap layar.</p>
        <Link href="/demo" className="mt-6 inline-block text-sm font-medium text-tanah-600 hover:text-daun-700">Ganti peran demo</Link>
      </div>
      <MobileFrame>{children}</MobileFrame>
      <div className="hidden lg:block" />
    </main>
  );
}
