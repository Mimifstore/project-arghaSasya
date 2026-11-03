// Semua angka di sini ILUSTRASI untuk prototype. Jangan dipresentasikan sebagai data transaksi nyata.

export type StatusKey =
  | "menunggu_verifikasi" | "sedang_diperiksa" | "terverifikasi" | "perlu_perbaikan" | "ditolak" | "nonaktif"
  | "draf" | "aktif" | "menerima_penawaran" | "negosiasi" | "terpenuhi_sebagian" | "terpenuhi" | "ditutup" | "dibatalkan"
  | "dikirim_penawaran" | "diterima_penawaran"
  | "belum_diperiksa" | "lolos" | "lolos_sebagian" | "tidak_lolos"
  | "disepakati" | "dikumpulkan" | "diperiksa" | "dikirim" | "diterima" | "dibayar";

// Biaya layanan sementara. Samakan dengan angka di Business Model Canvas.
export const SERVICE_FEE_PCT = 3;

export const buyer = {
  id: "b1", name: "CV Dapur Nusantara", pic: "Rina Kusumawati", type: "Katering", city: "Bandung", status: "terverifikasi" as StatusKey,
};

export type FarmerGroup = {
  id: string; name: string; village: string; chair: string; members: number; landHa: number;
  commodities: string[]; reliability: number; fulfillmentPct: number; completedOrders: number; status: StatusKey;
};

export const farmerGroups: FarmerGroup[] = [
  { id: "g1", name: "Gapoktan Tani Makmur", village: "Cikajang", chair: "Dedi Supriadi", members: 48, landHa: 36, commodities: ["Kentang Granola", "Kubis"], reliability: 4.7, fulfillmentPct: 96, completedOrders: 14, status: "terverifikasi" },
  { id: "g2", name: "Gapoktan Sumber Rejeki", village: "Pasirwangi", chair: "Ujang Hermawan", members: 32, landHa: 21, commodities: ["Kentang Granola", "Cabai merah keriting"], reliability: 4.4, fulfillmentPct: 91, completedOrders: 9, status: "terverifikasi" },
  { id: "g3", name: "Gapoktan Mekar Tani", village: "Cisurupan", chair: "Cecep Rohman", members: 61, landHa: 52, commodities: ["Kentang Granola", "Bawang merah"], reliability: 4.9, fulfillmentPct: 98, completedOrders: 22, status: "terverifikasi" },
];
export const getGroup = (id: string) => farmerGroups.find((g) => g.id === id)!;

export const buyerRequest = {
  id: "REQ-2611-0042", commodity: "Kentang", variety: "Granola", volumeKg: 2000, deliveryDate: "2026-12-15",
  deliveryLocation: "Dapur pusat CV Dapur Nusantara, Kiaracondong, Bandung", validUntil: "2026-11-25",
  status: "menerima_penawaran" as StatusKey, payment: "Transfer 3 hari setelah barang diterima",
  quality: [
    { name: "Diameter umbi", standard: "5–7 cm" },
    { name: "Tingkat kerusakan", standard: "maks. 5%" },
    { name: "Kebersihan (tanah menempel)", standard: "maks. 3%" },
    { name: "Kemasan", standard: "Karung jaring 25 kg" },
  ],
};

export const offers = [
  { id: "o1", groupId: "g1", volumeKg: 2000, pricePerKg: 11500, readyDate: "2026-12-12", pickup: "Cikajang", distanceKm: 98, status: "dikirim_penawaran" as StatusKey },
  { id: "o2", groupId: "g2", volumeKg: 1500, pricePerKg: 11000, readyDate: "2026-12-10", pickup: "Pasirwangi", distanceKm: 84, status: "dikirim_penawaran" as StatusKey },
  { id: "o3", groupId: "g3", volumeKg: 2000, pricePerKg: 12000, readyDate: "2026-12-13", pickup: "Cisurupan", distanceKm: 91, status: "dikirim_penawaran" as StatusKey },
];

export const farmerBoard = [
  { id: "REQ-2611-0042", buyer: "CV Dapur Nusantara", city: "Bandung", commodity: "Kentang Granola", volumeKg: 2000, deliveryDate: "2026-12-15", matchPct: 92 },
  { id: "REQ-2611-0045", buyer: "Rumah Makan Sunda Lembur", city: "Bandung", commodity: "Cabai merah keriting", volumeKg: 500, deliveryDate: "2026-12-05", matchPct: 74 },
  { id: "REQ-2611-0047", buyer: "PT Olah Pangan Priangan", city: "Bekasi", commodity: "Bawang merah", volumeKg: 1000, deliveryDate: "2026-12-20", matchPct: 58 },
];
export const farmerSupply = { groupId: "g1", commodity: "Kentang Granola", confirmedKg: 6500, allocatedKg: 0 };

export const orderSteps = [
  { key: "disepakati", label: "Disepakati", date: "2026-11-12" },
  { key: "dikumpulkan", label: "Dikumpulkan", date: "2026-12-10" },
  { key: "diperiksa", label: "Diperiksa" },
  { key: "dikirim", label: "Dikirim" },
  { key: "diterima", label: "Diterima" },
  { key: "dibayar", label: "Dibayar" },
];

export const order = {
  id: "ARG-ORD-2611-0007", requestId: buyerRequest.id, offerId: "o1", groupId: "g1", volumeKg: 2000, pricePerKg: 11500,
  qcFee: 300000, logisticsFee: 1200000, currentStep: 2, approvals: { buyer: false, farmer: false },
};

export const qcBatch = {
  id: "BTH-GRT-0001", orderId: order.id, groupId: "g1", inspector: "Asep Sunandar", date: "2026-12-10",
  location: "Titik kumpul Gapoktan Tani Makmur, Cikajang", checkedKg: 2000, passedKg: 1880, failedKg: 120, status: "lolos_sebagian" as StatusKey,
  params: [
    { name: "Diameter umbi", standard: "5–7 cm", result: "5,2–7,4 cm", pass: true },
    { name: "Tingkat kerusakan", standard: "maks. 5%", result: "4,1%", pass: true },
    { name: "Kebersihan (tanah menempel)", standard: "maks. 3%", result: "3,8%", pass: false },
    { name: "Kemasan", standard: "Karung jaring 25 kg", result: "Sesuai", pass: true },
  ],
};

export const verificationQueue = [
  { id: "v1", name: "Gapoktan Harapan Jaya", role: "Kelompok tani", place: "Cilawu, Garut", submitted: "2026-11-01", status: "menunggu_verifikasi" as StatusKey },
  { id: "v2", name: "Restoran Sunda Lembur", role: "Pembeli", place: "Bandung", submitted: "2026-10-30", status: "sedang_diperiksa" as StatusKey },
  { id: "v3", name: "Gapoktan Tani Mukti", role: "Kelompok tani", place: "Samarang, Garut", submitted: "2026-10-29", status: "perlu_perbaikan" as StatusKey },
  { id: "v4", name: "PT Olah Pangan Priangan", role: "Pembeli", place: "Bekasi", submitted: "2026-10-28", status: "menunggu_verifikasi" as StatusKey },
  { id: "v5", name: "Gapoktan Cipta Lestari", role: "Kelompok tani", place: "Banjarwangi, Garut", submitted: "2026-10-27", status: "menunggu_verifikasi" as StatusKey },
];

export const adminStats = { transaksiBulanIni: 186500000, pesananAktif: 7, kelompokTerverifikasi: 12, pemenuhanPct: 94, komisi: 5595000 };
export const monthlyTransactions = [
  { month: "Jun", juta: 12, ton: 1.1 }, { month: "Jul", juta: 28, ton: 2.4 }, { month: "Agu", juta: 47, ton: 4.0 },
  { month: "Sep", juta: 81, ton: 6.9 }, { month: "Okt", juta: 126, ton: 10.6 }, { month: "Nov", juta: 186.5, ton: 15.8 },
];
