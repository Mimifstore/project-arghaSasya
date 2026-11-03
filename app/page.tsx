import Image from "next/image";
import Link from "next/link";
import { SHARE_COLORS } from "@/components/buyer/RouteMap";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { Logo } from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";
import { DEMO_PACKAGE, RULES, allocate, quote } from "@/data/agri";
import { cn, formatKg, formatRupiah } from "@/lib/utils";

// Warna langit di tepi atas foto, supaya area di atas foto menyambung tanpa garis.
const SKY = "linear-gradient(to right, #86a3cb 0%, #6997c8 20%, #6f9dcf 40%, #86add6 60%, #a8c0dc 80%, #adc5dd 100%)";
const FADE_TOP = {
  maskImage: "linear-gradient(to bottom, transparent 0%, #000 16%)",
  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 16%)",
};

const steps = [
  { title: "Petani belajar dan lulus kuis", text: "Modul sortir dan pascapanen berbahasa Sunda. Petani yang lulus kuis baru bisa masuk katalog." },
  { title: "Pembeli memesan satu paket", text: "Pilih grade dan jumlah, misalnya 1 ton. Tidak perlu memilih petani satu per satu." },
  { title: "Sistem menggabungkan panen", text: "Kuota dibagi otomatis ke beberapa petani menurut skor mutu, jadwal panen, dan jarak ke titik kumpul." },
  { title: "Petani menyortir dan memotret", text: "Notifikasi masuk lewat aplikasi atau WhatsApp. AI menilai foto, checklist melengkapinya, lalu barang dijemput." },
  { title: "Penerimaan diverifikasi, dana cair", text: "Pembeli memotret saat barang tiba, AI menilai ulang, harga menyesuaikan grade aktual, dan dana escrow cair dalam 1 sampai 2 hari." },
];

const features = [
  { title: "Train-to-Sell", text: "Belajar langsung menentukan harga. Hasil kuis dan penilaian tiap batch membentuk Skor Mutu Digital yang membuka pesanan berharga lebih tinggi." },
  { title: "Pool-to-Scale", text: "Petani berlahan sempit tetap bisa memenuhi pesanan industri. Panen digabung, dan pembayaran dibagi otomatis sesuai kontribusi." },
  { title: "Coexist-to-Grow", text: "Petani cukup menjual 10 sampai 20% panen terbaik lewat aplikasi dan tetap boleh menjual sisanya ke langganan lama. Porsinya naik bertahap." },
  { title: "Escrow dan ketertelusuran", text: "Dana pembeli ditahan sampai barang diterima. Asal kelompok tani, foto, dan skor mutu tiap batch bisa ditelusuri." },
];

function SampleOrder() {
  const plan = allocate(DEMO_PACKAGE.kg, DEMO_PACKAGE.deliveryDate);
  const q = quote(DEMO_PACKAGE.kg, DEMO_PACKAGE.grade, plan.allocs);
  const rows: [string, number][] = [[`Nilai pasokan Grade A, ${formatKg(DEMO_PACKAGE.kg)}`, q.gross], [`Biaya layanan pembeli ${RULES.feeBuyerPct}%`, q.feeBuyer], ["Ongkos kirim", q.logistics]];
  return (
    <div className="surface-raised overflow-hidden">
      <div className="p-6">
        <p className="text-sm text-tanah-500">Contoh paket 1 ton, dibagi otomatis ke {plan.allocs.length} petani</p>
        <p className="num mt-1 font-display text-4xl font-bold text-daun-700">{formatRupiah(q.buyerTotal)}</p>
        <div role="img" aria-label="Pembagian kuota per petani" className="mt-5 flex h-3 gap-0.5 overflow-hidden rounded-full">
          {plan.allocs.map((a, i) => <span key={a.farmer.id} style={{ width: `${(a.kg / DEMO_PACKAGE.kg) * 100}%`, background: SHARE_COLORS[i % SHARE_COLORS.length] }} />)}
        </div>
        <ul className="mt-3 space-y-1 text-sm">
          {plan.allocs.map((a, i) => (
            <li key={a.farmer.id} className="flex justify-between gap-3"><span className="flex items-center gap-2 text-tanah-600"><span className="h-2 w-2 rounded-sm" style={{ background: SHARE_COLORS[i % SHARE_COLORS.length] }} />{a.farmer.name}</span><span className="num font-medium">{formatKg(a.kg)}</span></li>
          ))}
        </ul>
        <dl className="num mt-5 divide-y divide-line border-t border-line text-sm">
          {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-tanah-500">{k}</dt><dd className="font-medium">{formatRupiah(v)}</dd></div>)}
        </dl>
      </div>
      <p className="num border-t border-line bg-tanah-50 px-6 py-4 text-sm text-tanah-600">Petani menerima <b className="text-tanah-900">{formatRupiah(q.farmersNet)}</b> setelah komisi {RULES.feeFarmerPct}%, cair 1 sampai 2 hari setelah penerimaan.</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden text-white" style={{ backgroundImage: SKY }}>
        <SiteHeader />
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-10 pt-32 lg:pt-40">
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">Jalur digital agar mutu panen petani Garut punya harga</h1>
          <p className="mt-6 max-w-xl text-lg text-white/90">
            Argha Sasya melatih petani, menilai mutu lewat foto dan AI, menggabungkan panen kecil menjadi pasokan besar, lalu menyalurkannya ke pembeli usaha dengan pembayaran escrow.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/demo" className={buttonVariants({ variant: "accent", size: "lg" })}>Coba demo</Link>
            <a href="#cara-kerja" className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "border border-white/40 text-white hover:bg-white/10 hover:text-white")}>Lihat cara kerja</a>
          </div>
        </div>
        <Image
          src="/images/hero.jpg" width={1820} height={864} priority sizes="100vw" style={FADE_TOP}
          alt="Rantai pasok pertanian: petani memanen sayur di lahan Garut, gudang distribusi, perusahaan, dan restoran pembeli"
          className="relative -mt-12 h-[340px] w-full object-cover object-[22%_55%] lg:-mt-16 lg:h-auto"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-b from-tanah-950/70 via-tanah-950/30 to-tanah-950/45" />
      </section>
      <p className="bg-tanah-950 px-6 py-5 text-sm text-tanah-300 lg:hidden">
        Dari kelompok tani, lewat distribusi dan logistik, ke perusahaan dan distributor, sampai ke pembeli usaha.
      </p>

      <section id="masalah" className="bg-white py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl"><Image src="/images/masalah.jpg" fill sizes="(min-width: 1024px) 560px, 100vw" alt="Petani dan hasil panen" className="object-cover" /></div>
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Petani Garut tidak sulit menjual. Masalahnya, mutu tidak dihargai</h2>
            <h3 className="mt-8 text-lg font-semibold text-daun-700">Dari sisi petani</h3>
            <p className="mt-2 text-tanah-700">Hasil panen sering diborong tanpa sortir, sehingga yang terbaik dan yang biasa dihargai sama. Petani kecil sulit memenuhi volume pembeli usaha, dan banyak yang ragu pada pembayaran non-tunai.</p>
            <h3 className="mt-6 text-lg font-semibold text-daun-700">Dari sisi pembeli</h3>
            <p className="mt-2 text-tanah-700">Sulit percaya pada pemasok baru. Mutu dan volume tidak selalu konsisten, dan asal barang sulit ditelusuri saat ada masalah.</p>
          </div>
        </div>
      </section>

      <section id="cara-kerja" className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">Aplikasi yang menjalankan prosesnya, dari belajar sampai dana cair</h2>
          <div className="mt-12 grid items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <ol>
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-daun-600 font-display text-lg font-bold text-white">{i + 1}</span>
                    {i < steps.length - 1 && <span aria-hidden className="mt-1 w-0.5 flex-1 bg-daun-200" />}
                  </div>
                  <div className="pb-9"><h3 className="pt-1.5 text-lg font-semibold">{s.title}</h3><p className="mt-1.5 max-w-md text-tanah-600">{s.text}</p></div>
                </li>
              ))}
            </ol>
            <div>
              <div className="relative aspect-[3/2] overflow-hidden rounded-2xl"><Image src="/images/cara-kerja.jpg" fill sizes="(min-width: 1024px) 480px, 100vw" alt="Pemeriksaan dan pengemasan hasil tani" className="object-cover" /></div>
              <p className="mt-3 text-sm text-tanah-500">Petani cukup menunggu notifikasi, menyortir, memotret, dan barang dijemput.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="bg-white py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-start gap-14 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="max-w-lg text-3xl font-bold sm:text-4xl">Dilatih, digabung, lalu dibayar sesuai mutu</h2>
            <p className="mt-4 max-w-lg text-tanah-600">Tiga pembeda yang bekerja dalam satu alur, bukan sekadar mempertemukan penjual dan pembeli.</p>
            <ul className="mt-10">
              {features.map((f) => (
                <li key={f.title} className="border-t border-line py-5"><h3 className="font-semibold">{f.title}</h3><p className="mt-1 max-w-md text-tanah-600">{f.text}</p></li>
              ))}
            </ul>
          </div>
          <div>
            <SampleOrder />
            <p className="mt-3 text-sm text-tanah-500">Contoh perhitungan dari prototype. Seluruh angka simulasi.</p>
          </div>
        </div>
      </section>

      <section id="garut" className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative h-48 overflow-hidden rounded-2xl sm:h-64 lg:h-80"><Image src="/images/garut.jpg" fill sizes="(min-width: 1152px) 1104px, 100vw" alt="Lahan pertanian dataran tinggi" className="object-cover" /></div>
          <h2 className="mt-12 max-w-2xl text-3xl font-bold sm:text-4xl">Dimulai dari satu komoditas di Garut, berkembang bertahap</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-16">
            <p className="text-tanah-700"><span className="block text-lg font-semibold text-daun-700">Pilot</span>Cabai merah keriting di satu sentra Garut, bersama kelompok tani yang lulus pelatihan dan pembeli usaha yang membutuhkan pemasok cadangan.</p>
            <p className="text-tanah-700"><span className="block text-lg font-semibold text-daun-700">Setelah terbukti</span>Kentang dan komoditas lain, lalu sentra lain di Jawa Barat, setelah pesanan berulang dan pembayaran tepat waktu terbukti.</p>
          </div>
        </div>
      </section>

      <section id="untuk-siapa" className="bg-tanah-900 py-20 text-tanah-100 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="max-w-xl text-3xl font-bold text-white sm:text-4xl">Dibuat untuk dua pihak yang saling membutuhkan</h2>
          <div className="mt-12 grid md:grid-cols-2 md:divide-x md:divide-tanah-700">
            <div className="pb-10 md:pb-0 md:pr-12">
              <h3 className="text-2xl font-bold text-white">Petani</h3>
              <ul className="mt-5">
                {["Belajar dan lulus kuis untuk masuk katalog", "Tunggu notifikasi pesanan, tidak perlu mencari pembeli", "Lihat harga dan hasil bersih sebelum menerima pesanan", "Dibayar 1 sampai 2 hari setelah penerimaan"].map((t) => <li key={t} className="border-t border-tanah-700 py-3">{t}</li>)}
              </ul>
              <Link href="/farmer/pelatihan" className={cn(buttonVariants({ variant: "accent" }), "mt-6")}>Mulai belajar</Link>
            </div>
            <div className="border-t border-tanah-700 pt-10 md:border-t-0 md:pl-12 md:pt-0">
              <h3 className="text-2xl font-bold text-white">Pembeli usaha</h3>
              <ul className="mt-5">
                {["Pesan satu paket tanpa memilih petani satu per satu", "Pemasok cadangan terverifikasi dengan skor mutu", "Asal, foto, dan hasil penilaian tiap batch bisa ditelusuri", "Dana ditahan escrow, harga menyesuaikan grade aktual"].map((t) => <li key={t} className="border-t border-tanah-700 py-3">{t}</li>)}
              </ul>
              <Link href="/buyer/requests/new" className={cn(buttonVariants({ variant: "ghost" }), "mt-6 border border-white/30 text-white hover:bg-white/10 hover:text-white")}>Pesan paket</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-tanah-950 py-10 text-sm text-tanah-400">
        <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-6 px-6">
          <div className="max-w-md">
            <Logo tone="light" />
            <p className="mt-4">Prototype untuk The 14th Ambassador of Business Edupreneur. Foto, angka, dan penilaian AI pada demo bersifat ilustrasi dan simulasi.</p>
          </div>
          <p className="max-w-xs">Tim: Wanda Muslimah Gojali, Miftahul Hikam, dan Moch Haikal Ilham Mahendra.</p>
        </div>
      </footer>
    </>
  );
}
