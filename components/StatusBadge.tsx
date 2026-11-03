import { Badge } from "@/components/ui/badge";
import type { StatusKey } from "@/data/dummy";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

export const STATUS: Record<StatusKey, { label: string; tone: Tone }> = {
  menunggu_verifikasi: { label: "Menunggu verifikasi", tone: "warning" },
  sedang_diperiksa: { label: "Sedang diperiksa", tone: "info" },
  terverifikasi: { label: "Terverifikasi", tone: "success" },
  perlu_perbaikan: { label: "Perlu perbaikan data", tone: "warning" },
  ditolak: { label: "Ditolak", tone: "danger" },
  nonaktif: { label: "Dinonaktifkan", tone: "neutral" },
  draf: { label: "Draf", tone: "neutral" },
  aktif: { label: "Aktif", tone: "success" },
  menerima_penawaran: { label: "Menerima penawaran", tone: "info" },
  negosiasi: { label: "Dalam negosiasi", tone: "warning" },
  terpenuhi_sebagian: { label: "Terpenuhi sebagian", tone: "warning" },
  terpenuhi: { label: "Terpenuhi", tone: "success" },
  ditutup: { label: "Ditutup", tone: "neutral" },
  dibatalkan: { label: "Dibatalkan", tone: "danger" },
  dikirim_penawaran: { label: "Penawaran dikirim", tone: "info" },
  diterima_penawaran: { label: "Penawaran diterima", tone: "success" },
  belum_diperiksa: { label: "Belum diperiksa", tone: "neutral" },
  lolos: { label: "Lolos", tone: "success" },
  lolos_sebagian: { label: "Lolos sebagian", tone: "warning" },
  tidak_lolos: { label: "Tidak lolos", tone: "danger" },
  disepakati: { label: "Disepakati", tone: "info" },
  dikumpulkan: { label: "Dikumpulkan", tone: "info" },
  diperiksa: { label: "Diperiksa", tone: "info" },
  dikirim: { label: "Dikirim", tone: "info" },
  diterima: { label: "Diterima", tone: "success" },
  dibayar: { label: "Dibayar", tone: "success" },
};

export function StatusBadge({ status, className }: { status: StatusKey; className?: string }) {
  const { label, tone } = STATUS[status];
  return (
    <Badge tone={tone} className={className}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </Badge>
  );
}
