import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Badge } from "@/components/ui/badge";

const roles = [
  { href: "/buyer/requests/new", title: "Pembeli", text: "Tulis kebutuhan, bandingkan penawaran, dan setujui pesanan.", first: "Buat permintaan", start: true },
  { href: "/farmer", title: "Kelompok tani", text: "Lihat permintaan yang cocok dan kirim penawaran dari HP.", first: "Papan permintaan" },
  { href: "/inspector/qc/1", title: "Petugas lapangan", text: "Catat hasil pemeriksaan kualitas per batch.", first: "Form pemeriksaan" },
  { href: "/admin", title: "Administrator", text: "Verifikasi akun dan pantau transaksi.", first: "Ringkasan" },
];

export default function DemoPage() {
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[5fr_6fr]">
      <aside className="relative isolate flex min-h-[380px] flex-col justify-between overflow-hidden bg-tanah-950 p-8 text-white lg:min-h-screen lg:p-12">
        <Image src="/images/hero.jpg" alt="" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="-z-10 object-cover object-[12%_100%]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-tanah-950/90 via-tanah-950/55 to-tanah-950/30" />
        <Link href="/" aria-label="Kembali ke beranda"><Logo tone="light" size="lg" /></Link>
        <div className="mt-16">
          <h1 className="max-w-md text-4xl font-bold leading-tight text-white lg:text-5xl">Coba alur Argha Sasya dari empat sisi</h1>
          <p className="mt-4 max-w-sm text-tanah-200">Satu transaksi kentang Granola, diikuti dari permintaan pembeli sampai pemeriksaan kualitas.</p>
        </div>
      </aside>

      <section className="flex flex-col justify-center bg-kabut px-6 py-14 lg:px-16">
        <div className="mx-auto w-full max-w-xl">
          <h2 className="text-2xl font-bold">Pilih peran</h2>
          <p className="mt-1.5 text-tanah-600">Disarankan mulai dari pembeli supaya alurnya berurutan.</p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {roles.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="group -mx-3 flex items-center justify-between gap-6 rounded-lg px-3 py-6 transition-colors hover:bg-white">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold">{r.title}</h3>
                      {r.start && <Badge tone="warning">Mulai dari sini</Badge>}
                    </div>
                    <p className="mt-1 text-tanah-600">{r.text}</p>
                    <p className="mt-2 text-sm font-semibold text-daun-700">Layar pertama: {r.first}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-tanah-400 transition-transform group-hover:translate-x-1 group-hover:text-daun-700" />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/" className="mt-6 inline-block text-sm font-medium text-tanah-600 hover:text-daun-700">Kembali ke beranda</Link>
        </div>
      </section>
    </main>
  );
}
