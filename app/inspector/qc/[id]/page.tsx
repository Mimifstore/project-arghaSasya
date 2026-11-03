import { AppShell } from "@/components/AppShell";
import { QcForm } from "@/components/QcForm";

export default function QcPage() {
  return (
    <AppShell role="inspector" title="Pemeriksaan kualitas" description="Catat hasil pemeriksaan per batch sesuai standar yang disepakati. Anda hanya melihat transaksi yang ditugaskan kepada Anda.">
      <QcForm />
    </AppShell>
  );
}
