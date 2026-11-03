// Mengambil screenshot prototype untuk lampiran lomba (alur model baru).
// Cara pakai (di folder project):
//   1. npm i -D playwright && npx playwright install chromium
//   2. npm run build && npm start        (biarkan jalan di terminal ini)
//   3. node scripts/screenshots.mjs      (di terminal lain)
// Hasil ada di folder screenshots/. Pakai build produksi supaya tidak ada indikator Next.js dev di gambar.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = "screenshots";
const W = 1440, H = 900;
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, locale: "id-ID" });
const page = await context.newPage();

async function open(path, settle = 800) {
  await page.setViewportSize({ width: W, height: H });
  await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(settle);
}
async function fullShot(file) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewportSize({ width: W, height: Math.max(H, h) });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${file}` });
}
const frame = () => page.locator('div[class*="rounded-[44px]"]').first();
const frameShot = async (file) => { await page.waitForTimeout(300); await frame().screenshot({ path: `${OUT}/${file}` }); };
async function shot(file, fn) {
  try { await fn(); console.log("OK    ", file); }
  catch (e) { console.log("GAGAL ", file, "->", e.message.split("\n")[0]); }
}

// Urutan penting: sisi petani dulu, karena status lulus pelatihan tersimpan di browser dan dipakai halaman berikutnya.
await shot("01-beranda-hero.png", async () => { await open("/"); await page.locator("section").first().screenshot({ path: `${OUT}/01-beranda-hero.png` }); });
await shot("02-beranda-cara-kerja.png", async () => { await open("/"); await page.locator("#cara-kerja").screenshot({ path: `${OUT}/02-beranda-cara-kerja.png` }); });
await shot("03-petani-terkunci.png", async () => { await open("/farmer"); await frameShot("03-petani-terkunci.png"); });

await shot("04-petani-pelatihan-kuis.png", async () => {
  await open("/farmer/pelatihan");
  for (let i = 0; i < 2; i++) await page.getByRole("button", { name: "Selesai" }).first().click();
  await page.getByRole("button", { name: "Mulai" }).click();
  const correct = [2, 1, 0, 1, 1];
  for (let q = 0; q < 5; q++) await page.locator(`input[name="q${q}"]`).nth(correct[q]).check();
  await frameShot("04-petani-pelatihan-kuis.png");
  await page.getByRole("button", { name: "Kirim jawaban" }).click();
  await page.waitForTimeout(300);
});
await shot("05-petani-beranda-terlatih.png", async () => { await open("/farmer"); await frameShot("05-petani-beranda-terlatih.png"); });
await shot("06-petani-pesanan-masuk.png", async () => {
  await open("/farmer/pesanan");
  await page.getByRole("button", { name: "Terima pesanan" }).click();
  await frameShot("06-petani-pesanan-masuk.png");
});
await shot("07-petani-hasil-ai.png", async () => {
  await open("/farmer/pesanan/foto");
  await page.getByRole("button", { name: "Nilai dengan AI" }).click();
  await page.getByText("Hasil penilaian AI").waitFor({ timeout: 8000 });
  for (const c of await page.locator('input[type="checkbox"]').all()) await c.check();
  await frameShot("07-petani-hasil-ai.png");
  await page.getByRole("button", { name: "Kirim penilaian" }).click();
  await frameShot("08-petani-badge.png");
  console.log("OK     08-petani-badge.png");
});

await shot("09-pembeli-pesan-paket.png", async () => { await open("/buyer/requests/new", 2200); await fullShot("09-pembeli-pesan-paket.png"); });
await shot("10-pembeli-alokasi.png", async () => {
  await open("/buyer/requests/1");
  await page.locator("button[aria-expanded]").first().click();
  await fullShot("10-pembeli-alokasi.png");
});
await shot("11-pesanan-verifikasi.png", async () => {
  await open("/orders/1");
  await page.getByRole("button", { name: /^Bayar/ }).click();
  for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Majukan status" }).click();
  await page.getByRole("button", { name: "Kirim foto dan nilai ulang" }).click();
  await page.getByText("Penyesuaian harga otomatis").waitFor({ timeout: 8000 });
  await fullShot("11-pesanan-verifikasi.png");
});
await shot("12-admin-dashboard.png", async () => { await open("/admin", 2200); await fullShot("12-admin-dashboard.png"); });

await browser.close();
console.log(`\nSelesai. Cek folder ${OUT}/`);
