import { AppShell } from "@/components/AppShell";
import { RequestForm } from "@/components/RequestForm";

export default function NewRequestPage() {
  return (
    <AppShell role="buyer" title="Buat permintaan pembelian" description="Sampaikan kebutuhan Anda. Kelompok tani yang cocok akan menanggapi dengan penawaran.">
      <RequestForm />
    </AppShell>
  );
}
