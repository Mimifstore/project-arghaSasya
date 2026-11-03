"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ClipboardCheck, FilePlus2, Inbox, LayoutDashboard, ReceiptText, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

export type RoleKey = "buyer" | "inspector" | "admin";

const ICONS: Record<string, LucideIcon> = { plus: FilePlus2, inbox: Inbox, receipt: ReceiptText, clipboard: ClipboardCheck, layout: LayoutDashboard };

const ROLES: Record<RoleKey, { roleLabel: string; user: string; org: string; nav: { href: string; label: string; icon: keyof typeof ICONS }[] }> = {
  buyer: {
    roleLabel: "Portal pembeli", user: "Rina Kusumawati", org: "CV Dapur Nusantara",
    nav: [
      { href: "/buyer/requests/new", label: "Pesan paket", icon: "plus" },
      { href: "/buyer/requests/1", label: "Alokasi pasokan", icon: "inbox" },
      { href: "/orders/1", label: "Pesanan", icon: "receipt" },
    ],
  },
  inspector: {
    roleLabel: "Portal petugas lapangan", user: "Asep Sunandar", org: "Petugas lapangan, Garut",
    nav: [{ href: "/inspector/qc/1", label: "Pemeriksaan kualitas", icon: "clipboard" }],
  },
  admin: {
    roleLabel: "Dashboard administrator", user: "Tim operasional", org: "Argha Sasya",
    nav: [{ href: "/admin", label: "Ringkasan", icon: "layout" }],
  },
};

export function AppShell({ role, title, description, actions, children }: {
  role: RoleKey; title: string; description?: string; actions?: React.ReactNode; children: React.ReactNode;
}) {
  const pathname = usePathname();
  const cfg = ROLES[role];
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
      <aside className="hidden bg-tanah-900 text-tanah-200 lg:block">
        <div className="sticky top-0 flex flex-col px-4 py-6">
        <Logo tone="light" className="px-2" />
        <p className="mt-6 px-2 text-sm text-tanah-400">{cfg.roleLabel}</p>
        <nav className="mt-2 space-y-1">
          {cfg.nav.map((n) => {
            const Icon = ICONS[n.icon];
            return (
              <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined}
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(n.href) ? "bg-tanah-800 text-white shadow-[inset_3px_0_0_#F5B921]" : "hover:bg-tanah-800/60 hover:text-white")}>
                <Icon className="h-[18px] w-[18px]" />{n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 border-t border-tanah-700 pt-4">
          <p className="px-2 text-sm font-semibold text-white">{cfg.user}</p>
          <p className="px-2 text-xs text-tanah-400">{cfg.org}</p>
          <Link href="/demo" className="mt-3 flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-tanah-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" />Ganti peran demo
          </Link>
        </div>
      </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="bg-tanah-900 px-5 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <Logo tone="light" />
            <Link href="/demo" className="text-sm text-tanah-300">Ganti peran</Link>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto">
            {cfg.nav.map((n) => (
              <Link key={n.href} href={n.href} className={cn("whitespace-nowrap rounded-lg px-3 py-1.5 text-sm", isActive(n.href) ? "bg-tanah-800 text-white" : "text-tanah-300")}>{n.label}</Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 lg:px-10 lg:py-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{title}</h1>
              {description && <p className="mt-1.5 max-w-prose text-tanah-600">{description}</p>}
            </div>
            {actions}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
