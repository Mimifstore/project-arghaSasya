import { AppShell } from "@/components/AppShell";
import { OrderView } from "@/components/orders/OrderView";
import { DEMO_PACKAGE, type Grade } from "@/data/agri";

export default function OrderPage({ searchParams }: { searchParams: { kg?: string; grade?: string; tgl?: string } }) {
  const kg = Math.min(5000, Math.max(100, Number(searchParams.kg) || DEMO_PACKAGE.kg));
  const grade: Grade = searchParams.grade === "B" ? "B" : "A";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(searchParams.tgl ?? "") ? searchParams.tgl! : DEMO_PACKAGE.deliveryDate;
  return (
    <AppShell role="buyer" title="Pesanan dan pembayaran" description="Dana Anda ditahan di escrow, mutu dinilai ulang saat barang tiba, dan harga menyesuaikan grade aktual sebelum dana cair ke petani.">
      <OrderView kg={kg} grade={grade} date={date} />
    </AppShell>
  );
}
