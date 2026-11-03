import { redirect } from "next/navigation";

// Alur lama (petani mengirim penawaran) diganti dispatch otomatis. Rute ini dialihkan ke pesanan masuk.
export default function OldOfferPage() { redirect("/farmer/pesanan"); }
