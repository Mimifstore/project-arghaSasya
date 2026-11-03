# Argha Sasya: prototype (Tahap 0 dan 1)

## Cara menjalankan
1. Ekstrak zip ini ke folder kosong (jangan jalankan `create-next-app` dulu, project ini sudah lengkap).
2. Pastikan Node.js versi 18.18 atau lebih baru.
3. Jalankan:
   ```bash
   npm install
   npm run dev
   ```
4. Buka http://localhost:3000, lalu klik "Lihat komponen" (atau langsung ke `/komponen`).

Butuh internet saat `npm install` dan saat pertama kali jalan (font Google diunduh Next.js).

## Isi
- `tailwind.config.ts`: palet (daun, tanah, kunyit, cabai, langit, kabut) dan font.
- `data/dummy.ts`: semua tokoh dan angka dummy untuk 9 layar.
- `components/`: StatusBadge, StepTimeline, PriceBreakdown, MobileFrame, AppShell, Logo.
- `components/ui/`: Button dan Badge (ditulis manual, tidak perlu shadcn CLI).
- `app/komponen/page.tsx`: halaman uji semua komponen.

## Catatan penting
- Semua angka di `dummy.ts` hanya ilustrasi. Di dokumen lomba, beri label "simulasi" atau "ilustrasi", jangan diklaim sebagai transaksi nyata.
- `SERVICE_FEE_PCT` (3%) masih sementara. Samakan dengan angka di Business Model Canvas.
- Menu di sidebar mengarah ke halaman yang dibuat di tahap berikutnya, jadi sementara masih 404.
