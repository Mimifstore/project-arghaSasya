import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatRupiah = (n: number) => "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(n));
export const formatKg = (n: number) => new Intl.NumberFormat("id-ID").format(n) + " kg";
export const formatTanggal = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso + "T00:00:00"));
