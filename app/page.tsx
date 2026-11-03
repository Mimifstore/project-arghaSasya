import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { Logo } from "@/components/Logo";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { buttonVariants } from "@/components/ui/button";
import { SERVICE_FEE_PCT, order } from "@/data/dummy";
import { cn } from "@/lib/utils";

// Warna langit di tepi atas foto, supaya area di atas foto menyambung tanpa garis.
const SKY = "linear-gradient(to right, #86a3cb 0%, #6997c8 20%, #6f9dcf 40%, #86add6 60%, #a8c0dc 80%, #adc5dd 100%)";
const FADE_TOP = {
  maskImage: "linear-gradient(to bottom, transparent 0%, #000 16%)",
  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 16%)",
};

const steps = [
  { title: "Pembeli menulis kebutuhan", text: "Komoditas, volume, jadwal kirim, dan standar kualitas diisi dalam satu formulir." },
  { title: "Kelompok tani menawarkan", text: "Gapoktan yang cocok melihat permintaan, lalu mengirim harga dan volume yang sanggup dipasok." },
  { title: "Kedua pihak menyetujui", text: "Ringkasan kesepakatan tampil sebelum pesanan dibuat. Setiap perubahan perlu persetujuan." },
  { title: "Barang diperiksa dan dikirim", text: "Petugas lapangan mencatat hasil per batch, lalu pengiriman dan pembayaran dipantau." },
];

const features = [
  { title: "Kecocokan pemasok", text: "Permintaan diurutkan menurut komoditas, jadwal panen, lokasi, dan riwayat pemenuhan pesanan." },
  { title: "Rincian yang transparan", text: "Nilai dasar, biaya layanan, dan hasil bersih petani terlihat sebelum pesanan disetujui." },
  { title: "Jejak batch", text: "Tiap batch punya nomor yang terhubung ke kelompok, pesanan, hasil pemeriksaan, dan penerimaan." },
  { title: "Pendamping lapangan", text: "Petugas membantu pendaftaran dan pencatatan bagi petani yang belum terbiasa memakai aplikasi." },
];

export default function Home() {
  return (
    <>
      {/* Hero: foto jadi latar penuh, langit diperpanjang ke atas supaya teks muat di dalam gambar, lalu digelapkan tipis */}
      <section className="relative isolate overflow-hidden text-white" style={{ backgroundImage: SKY }}>
        <SiteHeader />
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-10 pt-32 lg:pt-40">
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Pengadaan hasil tani yang jelas, dari ladang sampai dapur pembeli
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/90">
            Argha Sasya menghubungkan kelompok tani Garut dengan distributor, katering, dan restoran. Harga, standar kualitas, dan potongan tercatat sejak awal.
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
            <h2 className="text-3xl font-bold sm:text-4xl">Pasokan hasil tani masih bergantung pada kenalan dan kira-kira</h2>
            <h3 className="mt-8 text-lg font-semibold text-daun-700">Dari sisi kelompok tani</h3>
            <p className="mt-2 text-tanah-700">
              Sulit menjangkau pembeli usaha yang butuh pasokan rutin. Standar kualitas dan potongan sering baru diketahui setelah barang tiba, dan hasil panen anggota sulit digabung untuk memenuhi satu pesanan besar.
            </p>
            <h3 className="mt-6 text-lg font-semibold text-daun-700">Dari sisi pembeli</h3>
            <p className="mt-2 text-tanah-700">
              Mencari dan memeriksa pemasok baru memakan waktu, sementara kualitas dan volume tidak selalu konsisten. Saat ada masalah, asal barang sulit ditelusuri.
            </p>
          </div>
        </div>
      </section>

      <section id="cara-kerja" className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">Empat langkah dari kebutuhan sampai barang diterima</h2>
          <div className="mt-12 grid items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <ol>
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-daun-600 font-display text-lg font-bold text-white">{i + 1}</span>
                    {i < steps.length - 1 && <span aria-hidden className="mt-1 w-0.5 flex-1 bg-daun-200" />}
                  </div>
                  <div className="pb-9">
                    <h3 className="pt-1.5 text-lg font-semibold">{s.title}</h3>
                    <p className="mt-1.5 max-w-md text-tanah-600">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div>
              <div className="relative aspect-[3/2] overflow-hidden rounded-2xl"><Image src="/images/cara-kerja.jpg" fill sizes="(min-width: 1024px) 480px, 100vw" alt="Pemeriksaan dan pengemasan hasil tani" className="object-cover" /></div>
              <p className="mt-3 text-sm text-tanah-500">Barang dikumpulkan, diperiksa per batch, lalu dikirim ke pembeli.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="bg-white py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-start gap-14 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="max-w-lg text-3xl font-bold sm:text-4xl">Setiap rupiah bisa dilacak sejak awal</h2>
            <p className="mt-4 max-w-lg text-tanah-600">Kesepakatan tidak berhenti di percakapan. Semua yang penting tercatat dan bisa dilihat pihak yang berhak.</p>
            <ul className="mt-10">
              {features.map((f) => (
                <li key={f.title} className="border-t border-line py-5">
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 max-w-md text-tanah-600">{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <PriceBreakdown volumeKg={order.volumeKg} pricePerKg={order.pricePerKg} serviceFeePct={SERVICE_FEE_PCT} qcFee={order.qcFee} logisticsFee={order.logisticsFee} />
            <p className="mt-3 text-sm text-tanah-500">Contoh rincian pesanan kentang Granola. Data ilustrasi.</p>
          </div>
        </div>
      </section>

      <section id="garut" className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative h-48 overflow-hidden rounded-2xl sm:h-64 lg:h-80"><Image src="/images/garut.jpg" fill sizes="(min-width: 1152px) 1104px, 100vw" alt="Lahan pertanian dataran tinggi" className="object-cover" /></div>
          <h2 className="mt-12 max-w-2xl text-3xl font-bold sm:text-4xl">Dimulai dari Garut, berkembang bertahap</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-16">
            <p className="text-tanah-700">
              <span className="block text-lg font-semibold text-daun-700">Tahap awal</span>
              Transaksi hasil pertanian di Kabupaten Garut, dimulai dari kentang, cabai, dan bawang bersama kelompok tani yang sudah terverifikasi.
            </p>
            <p className="text-tanah-700">
              <span className="block text-lg font-semibold text-daun-700">Tahap lanjut</span>
              Layanan tambahan seperti pupuk dan pembiayaan dikembangkan setelah alur transaksi inti berjalan stabil.
            </p>
          </div>
        </div>
      </section>

      <section id="untuk-siapa" className="bg-tanah-900 py-20 text-tanah-100 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="max-w-xl text-3xl font-bold text-white sm:text-4xl">Dibuat untuk dua pihak yang saling membutuhkan</h2>
          <div className="mt-12 grid md:grid-cols-2 md:divide-x md:divide-tanah-700">
            <div className="pb-10 md:pb-0 md:pr-12">
              <h3 className="text-2xl font-bold text-white">Kelompok tani</h3>
              <ul className="mt-5">
                {["Lihat permintaan yang cocok dengan komoditas dan jadwal panen", "Ketahui harga dan hasil bersih sebelum menyetujui", "Pantau pemeriksaan, pengiriman, dan pembayaran"].map((t) => (
                  <li key={t} className="border-t border-tanah-700 py-3">{t}</li>
                ))}
              </ul>
              <Link href="/farmer" className={cn(buttonVariants({ variant: "accent" }), "mt-6")}>Buka portal tani</Link>
            </div>
            <div className="border-t border-tanah-700 pt-10 md:border-t-0 md:pl-12 md:pt-0">
              <h3 className="text-2xl font-bold text-white">Pembeli usaha</h3>
              <ul className="mt-5">
                {["Bandingkan penawaran dari beberapa kelompok tani", "Tetapkan standar kualitas yang terukur", "Telusuri asal dan hasil pemeriksaan tiap batch"].map((t) => (
                  <li key={t} className="border-t border-tanah-700 py-3">{t}</li>
                ))}
              </ul>
              <Link href="/buyer/requests/new" className={cn(buttonVariants({ variant: "ghost" }), "mt-6 border border-white/30 text-white hover:bg-white/10 hover:text-white")}>Buat permintaan</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-tanah-950 py-10 text-sm text-tanah-400">
        <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-6 px-6">
          <div className="max-w-md">
            <Logo tone="light" />
            <p className="mt-4">Prototype untuk The 14th Ambassador of Business Edupreneur. Foto dan seluruh data pada demo bersifat ilustrasi.</p>
          </div>
          <p className="max-w-xs">Tim: Wanda Muslimah Gojali, Miftahul Hikam, dan Moch Haikal Ilham Mahendra.</p>
        </div>
      </footer>
    </>
  );
}
