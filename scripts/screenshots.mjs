// Mengambil 9 screenshot prototype untuk lampiran lomba.
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

// Halaman penuh. Tinggi viewport disamakan dengan tinggi halaman supaya sidebar (h-screen) ikut penuh.
async function fullShot(file) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewportSize({ width: W, height: Math.max(H, h) });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${file}` });
}

const frame = () => page.locator('div[class*="rounded-[44px]"]').first();

async function shot(file, fn) {
  try { await fn(); console.log("OK    ", file); }
  catch (e) { console.log("GAGAL ", file, "->", e.message.split("\n")[0]); }
}

await shot("01-beranda-hero.png", async () => {
  await open("/");
  await page.locator("section").first().screenshot({ path: `${OUT}/01-beranda-hero.png` });
});

await shot("02-beranda-transparansi.png", async () => {
  await open("/");
  await page.locator("#fitur").screenshot({ path: `${OUT}/02-beranda-transparansi.png` });
});

await shot("03-pembeli-buat-permintaan.png", async () => {
  await open("/buyer/requests/new");
  await fullShot("03-pembeli-buat-permintaan.png");
});

await shot("04-pembeli-bandingkan-penawaran.png", async () => {
  await open("/buyer/requests/1");
  await fullShot("04-pembeli-bandingkan-penawaran.png");
});

await shot("05-tani-papan-permintaan.png", async () => {
  await open("/farmer");
  await frame().screenshot({ path: `${OUT}/05-tani-papan-permintaan.png` });
});

await shot("06-tani-peringatan-volume.png", async () => {
  await open("/farmer/offers/new");
  await page.getByLabel("Volume yang sanggup dipasok").fill("8000");
  await page.getByRole("button", { name: "Kirim penawaran" }).click();
  await page.getByRole("dialog").waitFor();
  await page.waitForTimeout(300);
  await frame().screenshot({ path: `${OUT}/06-tani-peringatan-volume.png` });
});

await shot("07-pesanan-kesepakatan.png", async () => {
  await open("/orders/1");
  await page.getByRole("button", { name: "Setujui sebagai pembeli" }).click();
  await page.getByRole("button", { name: "Setujui sebagai kelompok tani" }).click();
  for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Majukan status" }).click();
  await fullShot("07-pesanan-kesepakatan.png");
});

await shot("08-petugas-pemeriksaan-kualitas.png", async () => {
  await open("/inspector/qc/1");
  await fullShot("08-petugas-pemeriksaan-kualitas.png");
});

await shot("09-admin-dashboard.png", async () => {
  await open("/admin", 2200); // tunggu animasi grafik
  await page.getByRole("button", { name: "Setujui" }).first().click();
  await page.waitForTimeout(300);
  await fullShot("09-admin-dashboard.png");
});

await browser.close();
console.log(`\nSelesai. Cek folder ${OUT}/`);
