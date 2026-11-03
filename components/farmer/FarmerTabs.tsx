"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Home, Package, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/farmer", label: "Beranda", icon: Home },
  { href: "/farmer/pelatihan", label: "Belajar", icon: GraduationCap },
  { href: "/farmer/pasokan", label: "Pasokan", icon: Sprout },
  { href: "/farmer/pesanan", label: "Pesanan", icon: Package },
];

export function FarmerTabs() {
  const path = usePathname();
  const active = (href: string) => (href === "/farmer" ? path === "/farmer" : path.startsWith(href));
  return (
    <nav className="sticky bottom-0 grid grid-cols-4 border-t border-line bg-white px-2 pb-5 pt-2">
      {TABS.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}
          className={cn("flex flex-col items-center gap-1 py-1 text-xs font-medium", active(href) ? "text-daun-700" : "text-tanah-400")}>
          <Icon className="h-5 w-5" />{label}
        </Link>
      ))}
    </nav>
  );
}
