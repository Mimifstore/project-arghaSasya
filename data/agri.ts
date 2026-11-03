// Seluruh angka di sini adalah SIMULASI untuk prototype. Ubah aturan di RULES, tampilan ikut berubah.

export type Grade = "A" | "B" | "C";

// Standar grade contoh. Perlu dikalibrasi bersama penyuluh (PPL) sebelum dipakai di lapangan.
export const GRADES: Record<Grade, { price: number; size: string; ripe: string; defect: string }> = {
  A: { price: 38000, size: "12–15 cm", ripe: "merah min. 90%", defect: "cacat maks. 3%" },
  B: { price: 33000, size: "10–12 cm", ripe: "merah min. 80%", defect: "cacat maks. 8%" },
  C: { price: 28000, size: "di bawah 10 cm", ripe: "merah min. 60%", defect: "cacat maks. 15%" },
};

export const RULES = {
  feeFarmerPct: 4,
  feeBuyerPct: 3,
  logisticsMarginPerKg: 200,
  lineHaulPerKg: 700,
  pickupPerKmPerKg: 15,
  passScore: 70,
  maxPoolSharePct: 25,
  maxPortionPct: 20,
  receiveWindowHours: 12,
  adjustmentReservePct: 2,
};

export const SCORE_WEIGHTS = [
  { key: "grade", label: "Kesesuaian grade", weight: 40 },
  { key: "ontime", label: "Ketepatan pengiriman", weight: 25 },
  { key: "review", label: "Ulasan pembeli", weight: 20 },
  { key: "training", label: "Hasil pelatihan", weight: 15 },
] as const;

export type Components = [number, number, number, number];
export const qualityScore = (c: Components) => Math.round(c[0] * 0.4 + c[1] * 0.25 + c[2] * 0.2 + c[3] * 0.15);

export type Farmer = {
  id: string; name: string; group: string; village: string; distanceKm: number; stockKg: number;
  harvestDate: string; c: Components; trained: boolean; x: number; y: number;
};

export const PERSONA_ID = "f-dono";
export const FARMERS: Farmer[] = [
  { id: "f-euis", name: "Euis Komalasari", group: "Kelompok Tani Cintakarya", village: "Cintakarya, Samarang", distanceKm: 5, stockKg: 200, harvestDate: "2026-12-04", c: [94, 92, 93, 100], trained: true, x: 196, y: 178 },
  { id: "f-dono", name: "Dono Suryana", group: "Kelompok Tani Cintakarya", village: "Cintakarya, Samarang", distanceKm: 6, stockKg: 200, harvestDate: "2026-12-04", c: [92, 90, 88, 100], trained: true, x: 208, y: 168 },
  { id: "f-asep", name: "Asep Hermawan", group: "Kelompok Tani Cintakarya", village: "Cintakarya, Samarang", distanceKm: 7, stockKg: 250, harvestDate: "2026-12-05", c: [88, 88, 86, 100], trained: true, x: 186, y: 158 },
  { id: "f-ujang", name: "Ujang Saepudin", group: "Kelompok Tani Mekar Sari", village: "Mekarwangi, Samarang", distanceKm: 11, stockKg: 180, harvestDate: "2026-12-06", c: [84, 82, 80, 100], trained: true, x: 230, y: 204 },
  { id: "f-cecep", name: "Cecep Ruhiyat", group: "Kelompok Tani Mekar Sari", village: "Cikajang", distanceKm: 24, stockKg: 400, harvestDate: "2026-12-05", c: [90, 88, 88, 100], trained: true, x: 290, y: 236 },
  { id: "f-neneng", name: "Neneng Sumiati", group: "Kelompok Tani Sinar Tani", village: "Cikajang", distanceKm: 26, stockKg: 150, harvestDate: "2026-12-07", c: [78, 80, 76, 60], trained: true, x: 312, y: 226 },
  { id: "f-yayan", name: "Yayan Nurjaman", group: "Kelompok Tani Sinar Tani", village: "Cisurupan", distanceKm: 38, stockKg: 350, harvestDate: "2026-12-08", c: [86, 84, 82, 100], trained: true, x: 340, y: 188 },
  { id: "f-iis", name: "Iis Aisyah", group: "Kelompok Tani Sinar Tani", village: "Cisurupan", distanceKm: 40, stockKg: 120, harvestDate: "2026-12-09", c: [70, 72, 68, 60], trained: true, x: 352, y: 210 },
  { id: "f-komar", name: "Komar Wijaya", group: "Kelompok Tani Cintakarya", village: "Cintakarya, Samarang", distanceKm: 8, stockKg: 150, harvestDate: "2026-12-04", c: [0, 0, 0, 0], trained: false, x: 178, y: 190 },
];
export const COLLECT_POINT = { name: "Titik kumpul Samarang", x: 200, y: 172 };
export const BUYER_POINT = { name: "CV Dapur Nusantara, Bandung", x: 64, y: 58 };

export const DEMO_PACKAGE = { id: "PKG-2612-0042", commodity: "Cabai merah keriting", grade: "A" as Grade, kg: 1000, deliveryDate: "2026-12-12", buyer: "CV Dapur Nusantara", city: "Bandung", pickupDate: "2026-12-11" };

export type Allocation = { farmer: Farmer; kg: number; score: number };
export type Excluded = { farmer: Farmer; reason: string };

const addDays = (iso: string, d: number) => { const t = new Date(iso + "T00:00:00Z"); t.setUTCDate(t.getUTCDate() + d); return t.toISOString().slice(0, 10); };

// Pooling otomatis: hanya petani lulus pelatihan, punya stok, dan panen sebelum jadwal kirim.
// Urutan memakai skor mutu (50%), kedekatan ke titik kumpul (30%), dan jadwal (20%). Satu petani dibatasi maks. 25% paket.
export function allocate(pkgKg: number, deliveryISO: string, farmers: Farmer[] = FARMERS) {
  const excluded: Excluded[] = [];
  const eligible = farmers.filter((f) => {
    if (!f.trained) { excluded.push({ farmer: f, reason: "Belum lulus pelatihan" }); return false; }
    if (f.stockKg <= 0) { excluded.push({ farmer: f, reason: "Stok kosong" }); return false; }
    if (f.harvestDate > addDays(deliveryISO, -2)) { excluded.push({ farmer: f, reason: "Panen setelah jadwal kirim" }); return false; }
    return true;
  });
  const ranked = eligible
    .map((f) => {
      const geo = Math.max(0, 100 - f.distanceKm * 2);
      const sched = f.harvestDate <= addDays(deliveryISO, -3) ? 100 : 60;
      return { farmer: f, score: Math.round((0.5 * qualityScore(f.c) + 0.3 * geo + 0.2 * sched) * 10) / 10 };
    })
    .sort((a, b) => b.score - a.score);
  const cap = Math.ceil((pkgKg * RULES.maxPoolSharePct) / 100);
  let left = pkgKg;
  const allocs: Allocation[] = [];
  const reserve: Allocation[] = [];
  for (const r of ranked) {
    const kg = Math.min(r.farmer.stockKg, cap, left);
    if (kg > 0) { allocs.push({ ...r, kg }); left -= kg; } else reserve.push({ ...r, kg: 0 });
  }
  return { allocs, reserve, excluded, shortKg: left, capKg: cap };
}

export function quote(kg: number, grade: Grade, allocs: Allocation[]) {
  const gross = kg * GRADES[grade].price;
  const feeBuyer = Math.round((gross * RULES.feeBuyerPct) / 100);
  const feeFarmer = Math.round((gross * RULES.feeFarmerPct) / 100);
  const pickup = allocs.reduce((s, a) => s + a.kg * a.farmer.distanceKm * RULES.pickupPerKmPerKg, 0);
  const lineHaul = kg * RULES.lineHaulPerKg;
  const margin = kg * RULES.logisticsMarginPerKg;
  const logistics = pickup + lineHaul + margin;
  const avgKm = kg ? allocs.reduce((s, a) => s + a.kg * a.farmer.distanceKm, 0) / kg : 0;
  return { gross, feeBuyer, feeFarmer, pickup, lineHaul, margin, logistics, avgKm, buyerTotal: gross + feeBuyer + logistics, farmersNet: gross - feeFarmer, platform: feeBuyer + feeFarmer };
}

// Penyesuaian harga saat barang diterima: harga mengikuti grade aktual hasil penilaian ulang AI.
export function adjust(actual: Record<Grade, number>, promised: Grade) {
  const kg = actual.A + actual.B + actual.C;
  const promisedValue = kg * GRADES[promised].price;
  const actualValue = (["A", "B", "C"] as Grade[]).reduce((s, g) => s + actual[g] * GRADES[g].price, 0);
  return { kg, promisedValue, actualValue, diff: actualValue - promisedValue };
}

export const PRICE_SERIES = [
  { day: "27 Okt", A: 36500, C: 27000 }, { day: "28 Okt", A: 36800, C: 27200 }, { day: "29 Okt", A: 37200, C: 27500 },
  { day: "30 Okt", A: 37000, C: 27400 }, { day: "31 Okt", A: 37600, C: 27800 }, { day: "1 Nov", A: 37900, C: 28000 }, { day: "2 Nov", A: 38000, C: 28000 },
];
